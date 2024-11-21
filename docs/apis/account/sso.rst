==========================
mge-sso-认证服务接入指南
==========================

材料基因工程（以下简称MGE）统一平台，目前包括 mgedata、matcloud、ocpmdm、ipd 四个子平台，项目要求以 mgedata 为主平台，提供其他子平台入口。目前统一平台部署于北京计算中心，我们负责运维。

项目要求所有子平台采用统一登录的方式，以给用户统一平台的感觉，也避免用户在使用过程中需要多次输入用户名、密码进行登录操作。以前平台部署于北科大时，采用 BaseURL 的方式区分各个子平台，统一登录也是由我们在前端采用 js 发送请求来实现，**这种方式是不安全、不稳定的，用户体验无法保证，也容易遭受攻击**。现在平台部署于计算中心，各子平台采用二级域名区分，原来的方式也无法使用了，因为涉及到跨域请求的问题。为此，我们在 mgedata 平台中开发了**单点登录 （Single Sign-On，SSO）*认证服务***，以保证统一登录的安全与稳定，提升用户体验。

目前，由我们负责的原子势库（ipd）子系统已经接入 SSO 服务，可访问 [IPD](https://ipd.mgedata.cn/) 和 [MGEDATA](https://www.mgedata.cn/) 体验。


MGE SSO简单说明
-------------------

MGE SSO 认证机制跟市面上常见的 SSO 服务类似，主要包含三个接口，访问这三个接口可以获取用户信息、进行用户认证。


加密算法
--------------

通信消息采用 **AES（GCM）**加密算法加密，加密后的数据格式为 **nonce + cihpertext + tag** ，如果是 post 请求，则这些数据直接放在 body 部分，如果为 get 请求，则进行一次 base64 url safe 编码后，放置在对应参数位置。

加密使用的 **key** （即下方的 **accessSecret**） 需要向我们申请，下面 示例代码 部分提供了 Python 和 Java 的加密工具类示例代码，可以参考使用。

接口调用步骤
----------------

MGE SSO 包含三个接口，访问这三个接口可以获取用户信息、进行用户认证。具体接入步骤如下：

1. 向我们申请接入的**公钥 *accessKey***、*私钥 **accessSecret*** 及 *SSO 服务访问地址 **serverUrl***。**serverUrl** 目前为 https://www.mgedata.cn/sso/。
2. 将 accessKey 放在 http header 部分，header 名为 **==X-MGE-SSO-ACCESS-KEY== ，每次请求都必须携**带，否则无法识别。
3. SSO client 与 server 进行交互的数据应该进行二次封装，因为要提供时间戳以防重入。封装格式为 `{"_":  1528588646.452032, "data": <实际的数据>}`，其中 \_ 字段为 utc 时间戳（秒数），可以是整数或浮点数，有效期为 60s，**data** 字段为实际的数据。**下述的步骤中提到的 raw 的数据发送之前都应该按照上述步骤进行包装，收到数据之后也应该对应的进行拆包**。
4. client 向 SSO server 请求 token，请求地址为 **serverUrl + request-token/** ，请求方法为 post，携带数据为 `{"redirect_to": "<下一跳地址>"}`，下一跳地址应该为客户端接收 request-token 的回调地址，如 https://client.mgedta.cn/sso/client/authorization/?next=/index/ 。
5. sevrver 端接收到 token 请求后，会生成 **request\_token** 返回（**request\_token** 字段）。client 拆包得到 **request\_token** 后，应向 server 请求授权，请求地址为 serverUrl + authorize/ ，请求方法为 **get**，参数名为 **token**，值为request_token ，**这里的 token 不需要加密**。（可以直接跳转到对应地址）
6. server 端收到授权请求后，如果 request\_token 有效，则会生成 **access\_token** （**access\_token** 字段，Base64 Url Safe Encoded），跳转到上面的 **redirect\_to** 地址。
7. client （对应上面 /sso/client/authorization/ 接口）接收到 **access\_token** 之后，应该向 SSO server 验证得到的 token，请求地址为 **serverUrl + verify/**，请求方法为 **post**，携带数据为 `{"access_token": "<刚刚获取到的access_token>"}`。
8. server 端收到这个验证请求，如果 **access\_token** 无效或过期，则 server 返回对应错误。如果 access_token 有效，但是这个请求对应的用户不存在或者尚未登录，则会跳转到统一登录界面，用户登录后，后续步骤跟下面的类似。
9. 如果 **access\_token** 有效，则 server 将返回对应的用户的数据（请求的用户已经登录或者在上一步登录成功）。用户数据包括 **username**, **nickname**, **email**, **is\_active**, **avatar**, **sex**, **tel**, **institution**，其中 **username**, **email** 都是唯一的，***client*** 可以用其标识用户，**nickname** 为昵称，**is\_active** 表示该用户是否有效/合法，**avatar** 为头像地址，**sex** 为用户性别(M, F, U，分别代表男、女、未设置)，**tel** 为手机号，**institution** 为所属机构。
10. client 收到用户信息之后，应该进行查找用户/创建用户操作，然后登录该用户。


- **注意事项**

1. 拼接请求地址时，注意 serverUrl 末尾的 / 及请求地址前缀 /，否则容易出错。如 *https://www.mgedata.cn/sso/request-token/*，一不小心就会拼接成 *https://www.mgedata.cn/sso//request-token/*。
2. 要保证 client 所在主机的时间正确，否则时间戳不对，会得到签名过期的错误。
3. client 应记录用户登录状态，不需每次都向 server 进行认证。
4. 采用统一用户身份，但是各个 client 站点内的用户权限应该与 server 站点独立，所以 client 站点如果有权限控制应该另外设置。


交互流程图
------------

.. image:: https://s1.ax1x.com/2018/07/22/PGwG8S.png


示例项目
------------


这里提供 spring-boot 和 django 的具体实现。使用其它框架的可以参考实现

此外，如果你的项目是使用 Django 开发，则可以直接下载使用我们已经开发测试过的 django app。

[sso_client.django-app.rar](https://drive.google.com/open?id=1qPPvMSk3hqr6bER_S2OhyEIYgmkjfzpG)

如果你的项目是使用 Spring-boot 开发，也可以下载使用下面的 demo 项目。

[sso-client-demo.spring-boot.rar](https://drive.google.com/open?id=17cgTCm0daDRmaVYYy2rTaOsFrz8t98VH)


示例代码
------------

这里提供一下集中 的加密算法工具类，使用这写语言的可以直接使用，使用其它语言的可以参考其实现。

**Python**

::

    class AesGcmUtil:
        DEFAULT_ENCODING = 'utf-8'
        GCM_NONCE_LENGTH = 16
        GCM_TAG_LENGTH = 16

        def __init__(self, private_key: str):
            self.private_key = private_key.encode(self.DEFAULT_ENCODING)
            self.cipher = None
            self.nonce = None
            self.tag = None
            self.result = None

        def encrypt(self, data: (str, bytes)):
            if isinstance(data, str):
                data = data.encode(self.DEFAULT_ENCODING)

            self.cipher = AES.new(self.private_key, AES.MODE_GCM)
            self.nonce = self.cipher.nonce
            self.result, self.tag = self.cipher.encrypt_and_digest(data)

            return self.result

        def decrypt(self, nonce, data, tag) -> bytes:
            # self.nonce = nonce
            # self.tag = tag
            self.cipher = AES.new(self.private_key, AES.MODE_GCM, nonce=nonce)

            self.result = self.cipher.decrypt_and_verify(data, tag)

            return self.result

        def decrypt_wrapped_data(self, data):
            nonce, data, tag = self.unwrap(data)
            return self.decrypt(nonce, data, tag)

        def wrap(self):
            if not self.tag or not self.nonce or not self.result:
                raise ValueError('wrap can only be used after encrypt!')
            return self.nonce + self.result + self.tag

        def unwrap(self, data):
            nonce = data[:self.GCM_NONCE_LENGTH]
            tag = data[-self.GCM_TAG_LENGTH:]
            data = data[self.GCM_NONCE_LENGTH:-self.GCM_TAG_LENGTH]
            return nonce, data, tag


**Java**


::

    /**
    * @author yuvv
    * @date 2018/6/7
    */
    public class AesGcmUtils {

        public static final Charset CHARSET = StandardCharsets.UTF_8;
        private final String TRANSFORMATION = "AES/GCM/NoPadding";

        /**
        * 认证 tag 长度（字节）
        */
        private static final int GCM_TAG_LENGTH = 16;

        /**
        * nonce 长度（字节）.
        */
        private static final int GCM_NONCE_LENGTH = 16;

        /**
        * 密钥
        */
        private String secretKey;

        /**
        * 认证 tag
        */
        private byte[] authTag;

        /**
        * 加密 nonce
        */
        private byte[] nonce;

        /**
        * 密文串（不包含 tag）
        */
        private byte[] cipherText;

        public byte[] getAuthTag() {
            return authTag;
        }

        public byte[] getNonce() {
            return nonce;
        }

        public byte[] getCipherText() {
            return cipherText;
        }

        public String getCipherTextString() {
            return new String(cipherText, CHARSET);
        }

        public AesGcmUtils(String secretKey) {
            this.secretKey = secretKey;
            nonce = new byte[GCM_NONCE_LENGTH];
            authTag = new byte[GCM_TAG_LENGTH];
        }

        /**
        * 加密文本
        *
        * @param text 待加密字符串
        * @return 返回加密后的字节数组（注意末尾接了 tag）
        * @throws GeneralSecurityException 找不到对应算法或算法参数错误
        */
        public byte[] encrypt(String text) throws GeneralSecurityException {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            SecretKey key = new SecretKeySpec(secretKey.getBytes(CHARSET), "AES");

            SecureRandom random = SecureRandom.getInstanceStrong();

            random.nextBytes(nonce);

            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, nonce);
            cipher.init(Cipher.ENCRYPT_MODE, key, spec);

            byte[] result = cipher.doFinal(text.getBytes(CHARSET));
            cipherText = new byte[result.length - GCM_TAG_LENGTH];
            System.arraycopy(result, 0, cipherText, 0, result.length - GCM_TAG_LENGTH);
            System.arraycopy(result, result.length - GCM_TAG_LENGTH, authTag, 0, GCM_TAG_LENGTH);

            return result;
        }

        /**
        * 解密数据
        * @param nonce 加密所用 nonce 值
        * @param cipherText 待解密数据（包括 tag）
        * @return 解密之后的字符串
        * @throws GeneralSecurityException 找不到对应算法或算法参数错误
        */
        public String decrypt(byte[] nonce, byte[] cipherText) throws GeneralSecurityException {
            Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            SecretKey key = new SecretKeySpec(secretKey.getBytes(CHARSET), "AES");

            GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH * 8, nonce);
            cipher.init(Cipher.DECRYPT_MODE, key, spec);

            byte[] result = cipher.doFinal(cipherText);
            return new String(result, CHARSET);
        }

        public String decryptWrappedData(byte[] data)  throws GeneralSecurityException {
            System.arraycopy(data, 0, nonce, 0, GCM_NONCE_LENGTH);
            cipherText = new byte[data.length - GCM_TAG_LENGTH];
            System.arraycopy(data, GCM_NONCE_LENGTH, cipherText, 0, cipherText.length);
            return decrypt(nonce, cipherText);
        }

        /**
        * 加密之后封装 nonce + cipherText + authTag
        * @return 返回封装后结果
        */
        public byte[] wrapData() {
            byte[] wrappedData = new byte[nonce.length + cipherText.length + authTag.length];
            System.arraycopy(nonce, 0, wrappedData, 0, GCM_NONCE_LENGTH);
            System.arraycopy(cipherText, 0, wrappedData, GCM_NONCE_LENGTH, cipherText.length);
            System.arraycopy(authTag, 0, wrappedData, GCM_NONCE_LENGTH + cipherText.length, GCM_TAG_LENGTH);
            return wrappedData;
        }

        /**
        * 将封装好的数据拆开
        * @param data 待拆数据
        */
        public void unwrapData(byte[] data) {
            cipherText = new byte[data.length - GCM_NONCE_LENGTH - GCM_TAG_LENGTH];
            System.arraycopy(data, 0, nonce, 0, GCM_NONCE_LENGTH);
            System.arraycopy(data, GCM_NONCE_LENGTH, cipherText, 0,
                    data.length - GCM_NONCE_LENGTH - GCM_TAG_LENGTH);
            System.arraycopy(data, data.length - GCM_TAG_LENGTH, authTag, 0, GCM_TAG_LENGTH);
        }
    }


**C \#**

c# 需要安装 BouncyCastle 包，vs 中使用 NuGet 安装即可。

也可以到官网下载，http://www.bouncycastle.org/csharp/index.html

使用 .net core 的同学移步 https://www.nuget.org/packages/Portable.BouncyCastle/1.8.2

::

    using System;
    using System.Text;
    using System.IO;
    using Org.BouncyCastle.Crypto;
    using Org.BouncyCastle.Crypto.Engines;
    using Org.BouncyCastle.Crypto.Modes;
    using Org.BouncyCastle.Crypto.Parameters;
    using Org.BouncyCastle.Security;

    namespace Encryption {
        class AesGcm256 {

            private readonly SecureRandom Random = new SecureRandom();

            // 默认编码 utf8
            public readonly Encoding DEFAULT_ENCODING = Encoding.UTF8;

            // nonce 长度（字节）
            public readonly int GCM_NONCE_LENGTH = 16;

            // auth tag 长度（字节）
            public readonly int GCM_TAG_LENGTH = 16;


            private byte[] nonce;
            private byte[] authTag;
            private byte[] cipherText;
            private byte[] key;

            public AesGcm256(string key) {
                this.key = DEFAULT_ENCODING.GetBytes(key);
                nonce = new byte[GCM_NONCE_LENGTH];
                authTag = new byte[GCM_TAG_LENGTH];
            }

            public byte[] getNonce() {
                return nonce;
            }

            public byte[] getAuthTag() {
                return authTag;
            }

            public byte[] getCipherText() {
                return cipherText;
            }

            /// <summary>
            /// 加密字符串，会更新 nonce，authTag，cipherText
            /// </summary>
            /// <param name="msg">待加密字符串</param>
            /// <returns>返回加密后的结果。注意返回结果是 cipherText + authTag</returns>
            public byte[] encrypt(string msg) {
                var secretMessage = DEFAULT_ENCODING.GetBytes(msg);

                Random.NextBytes(nonce, 0, GCM_NONCE_LENGTH);

                var cipher = new GcmBlockCipher(new AesEngine());
                var parameters = new AeadParameters(new KeyParameter(key), GCM_TAG_LENGTH * 8, nonce);
                cipher.Init(true, parameters);

                //Generate Cipher Text With Auth Tag
                var result = new byte[cipher.GetOutputSize(secretMessage.Length)];
                var len = cipher.ProcessBytes(secretMessage, 0, secretMessage.Length, cipherText, 0);
                cipher.DoFinal(result, len);

                cipherText = new byte[result.Length - GCM_TAG_LENGTH];
                Array.Copy(result, 0, cipherText, 0, cipherText.Length);
                Array.Copy(result, cipherText.Length, authTag, 0, GCM_TAG_LENGTH);

                return result;
            }

            /// <summary>
            /// 验证并解密密文（解密并不会更新 nonce，authTag，cihperText 的值）
            /// </summary>
            /// <param name="nonce">nonce 值</param>
            /// <param name="cipherText">密文（cihperText + authTag）</param>
            /// <returns>返回解密后的字符串</returns>
            public String decrypt(byte[] nonce, byte[] cipherText) {
                using (var cipherStream = new MemoryStream(cipherText))
                using (var cipherReader = new BinaryReader(cipherStream)) {

                    var cipher = new GcmBlockCipher(new AesEngine());
                    var parameters = new AeadParameters(new KeyParameter(key), GCM_TAG_LENGTH * 8, nonce);
                    cipher.Init(false, parameters);

                    var plainText = new byte[cipher.GetOutputSize(cipherText.Length)];

                    try {
                        var len = cipher.ProcessBytes(cipherText, 0, cipherText.Length, plainText, 0);
                        cipher.DoFinal(plainText, len);
                    } catch (InvalidCipherTextException) {
                        return null;
                    }

                    return DEFAULT_ENCODING.GetString(plainText);
                }
            }

            /// <summary>
            /// 封包，封为 nonce + authTag + cihperText 形式
            /// </summary>
            /// <returns>返回封包之后结果</returns>
            public byte[] wrapData() {
                byte[] result = new byte[GCM_NONCE_LENGTH + cipherText.Length + GCM_TAG_LENGTH];
                nonce.CopyTo(result, 0);
                Array.Copy(cipherText, 0, result, GCM_NONCE_LENGTH, cipherText.Length);
                Array.Copy(authTag, 0, result, GCM_NONCE_LENGTH + cipherText.Length, GCM_TAG_LENGTH);
                return result;
            }

            /// <summary>
            /// 拆包，将 nonce + authTag + cihperText，拆开并设置到字段
            /// </summary>
            /// <param name="data">待拆数据</param>
            public void unwrapData(byte[] data) {
                cipherText = new byte[data.Length - GCM_TAG_LENGTH - GCM_NONCE_LENGTH];
                Array.Copy(data, 0, nonce, 0, GCM_NONCE_LENGTH);
                Array.Copy(data, GCM_NONCE_LENGTH, cipherText, 0, cipherText.Length);
                Array.Copy(data, data.Length - GCM_TAG_LENGTH, authTag, 0, GCM_TAG_LENGTH);
            }
        }
    }

