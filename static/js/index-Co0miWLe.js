var oe=Object.defineProperty;var q=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var E=(u,s,a)=>s in u?oe(u,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):u[s]=a,M=(u,s)=>{for(var a in s||(s={}))ne.call(s,a)&&E(u,a,s[a]);if(q)for(var a of q(s))se.call(s,a)&&E(u,a,s[a]);return u};var w=(u,s,a)=>new Promise((f,y)=>{var k=p=>{try{C(a.next(p))}catch(g){y(g)}},d=p=>{try{C(a.throw(p))}catch(g){y(g)}},C=p=>p.done?f(p.value):Promise.resolve(p.value).then(k,d);C((a=a.apply(u,s)).next())});import{t as ie,r as re,a as ue}from"./index-DJyng-Qi.js";import{r as ce}from"./setData-BXCfuNPN.js";import{d as de,i as c,j as pe,h as $,ak as me,C as _e,r as i,X as ve,o as x,k as N,b as j,e,w as n,f as v,H as fe,a as I,t as z,at as ge,u as be,ao as we,F as ye,J as ke,au as Ce,z as he,_ as Ve}from"./index-Dxllzmhq.js";import{r as xe}from"./index-DPt70WPP.js";const ze={class:"userTemplate leftTable"},Te={style:{color:"#dd2c2c"}},De=de({name:"userTemplate",__name:"index",setup(u){const s=c([]),a=c(1),f=c(10),y=c(0),k=c(!1),d=(l=1)=>w(this,null,function*(){k.value=!0,a.value=l;let o=M({page:a.value,page_size:f.value,review_state:h.value=="-1"?void 0:h.value},_);const r=yield re(o);console.log(r),r.code===0&&(s.value=r.data.results,y.value=r.data.total),k.value=!1}),C=l=>{f.value=l,d()},p=l=>{a.value=l,d(a.value)},g=l=>{var o;return(o=ce.find(r=>r.value==l))==null?void 0:o.label},D=c(),Q=()=>w(this,null,function*(){let l=yield xe();l.code===0&&(D.value=ke(l.data))});pe(()=>{d(),Q()});const h=c("-1"),R=(l,o)=>{h.value=l.props.name,d(void 0)},S=c(),_=$({title_or_abstract:"",category_id:void 0,public:void 0}),A=()=>{d()},H=l=>{l&&(l.resetFields(),d())},L=me(),J=()=>{L.push({name:"createTemplateManage",query:{}})},P=l=>{console.log(l),L.push({name:"updateTemplateManage",query:{id:l.id,type:"is_data"}})},X=$([]),B=c();_e("templateData",X);const G=l=>w(this,null,function*(){T.value=!0,B.value=l.row.id}),K=l=>w(this,null,function*(){Ce.confirm("确定要删除该模板吗？","删除模板",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>w(this,null,function*(){(yield ue(l.row.id)).code===0&&(he({type:"success",message:"删除成功"}),d(s.value.length>1?a.value:a.value-1))}))}),T=c(!1);return(l,o)=>{const r=i("el-tab-pane"),O=i("el-tabs"),W=i("el-input"),V=i("el-form-item"),Y=i("el-tree-select"),F=i("el-option"),Z=i("el-select"),b=i("el-button"),ee=i("el-form"),m=i("el-table-column"),te=i("el-tooltip"),ae=i("el-pagination"),le=ve("loading");return x(),N(ye,null,[j("div",ze,[e(O,{modelValue:h.value,"onUpdate:modelValue":o[0]||(o[0]=t=>h.value=t),class:"demo-tabs",onTabClick:R},{default:n(()=>[e(r,{label:"全部",name:"-1"}),e(r,{label:"待审核",name:"0"}),e(r,{label:"已通过",name:"1"}),e(r,{label:"未通过",name:"2"})]),_:1},8,["modelValue"]),e(ee,{ref_key:"conditionFormRef",ref:S,model:_,inline:!0,"label-width":"0",size:"large"},{default:n(()=>[e(V,{label:"",prop:"title_or_abstract"},{default:n(()=>[e(W,{modelValue:_.title_or_abstract,"onUpdate:modelValue":o[1]||(o[1]=t=>_.title_or_abstract=t),placeholder:"输入模板名称/摘要等关键字",style:{width:"283px"},clearable:""},null,8,["modelValue"])]),_:1}),e(V,{label:"",prop:"category_id"},{default:n(()=>[e(Y,{filterable:"",modelValue:_.category_id,"onUpdate:modelValue":o[2]||(o[2]=t=>_.category_id=t),data:D.value,style:{width:"283px"},"check-on-click-node":"","check-strictly":"",placeholder:"请选择分类"},null,8,["modelValue","data"])]),_:1}),e(V,{label:"",prop:"public"},{default:n(()=>[e(Z,{filterable:"",modelValue:_.public,"onUpdate:modelValue":o[3]||(o[3]=t=>_.public=t),placeholder:"请选择可见范围",style:{width:"283px"},clearable:""},{default:n(()=>[e(F,{label:"公开",value:"True"}),e(F,{label:"私有",value:"False"})]),_:1},8,["modelValue"])]),_:1}),e(V,{label:""},{default:n(()=>[e(b,{type:"primary",onClick:A},{default:n(()=>[v("查询")]),_:1}),e(b,{onClick:o[4]||(o[4]=t=>H(S.value))},{default:n(()=>[v("重置")]),_:1}),e(b,{plain:"",type:"primary",onClick:J},{default:n(()=>[v("新增")]),_:1})]),_:1})]),_:1},8,["model"]),fe((x(),I(be(we),{data:s.value,size:"large"},{default:n(()=>[e(m,{label:"序号",type:"index",index:1,width:"60",align:"center"}),e(m,{label:"模板名称","show-overflow-tooltip":"",prop:"title",width:"120",align:"center"}),e(m,{label:"摘要",prop:"abstract","show-overflow-tooltip":"","min-width":"300",align:"center"}),e(m,{label:"分类",prop:"category_name","min-width":"90",align:"center"}),e(m,{label:"可见范围",width:"150",align:"center"},{default:n(t=>[v(z(t.row.public?"公开":"私有"),1)]),_:1}),e(m,{label:"上传时间",prop:"pub_date",width:"170"}),e(m,{label:"审核人",prop:"reviewer_real_name",width:"110"}),e(m,{label:"审核状态",width:"100",align:"center"},{default:n(t=>[t.row.review_state==2?(x(),I(te,{key:0,placement:"top"},{content:n(()=>[v(z(t.row.disapprove_reason),1)]),default:n(()=>[j("span",Te,z(g(t.row.review_state)),1)]),_:2},1024)):(x(),N("span",{key:1,style:ge({color:t.row.review_state==1?"#888888":"#E5A303"})},z(g(t.row.review_state)),5))]),_:1}),e(m,{label:"操作",width:"200",fixed:"right",align:"center"},{default:n(t=>[e(b,{link:"",type:"primary",size:"small",onClick:U=>P(t.row)},{default:n(()=>[v(" 修改 ")]),_:2},1032,["onClick"]),e(b,{link:"",type:"primary",size:"small",onClick:U=>G(t)},{default:n(()=>[v(" 查看 ")]),_:2},1032,["onClick"]),e(b,{link:"",type:"danger",size:"small",onClick:U=>K(t)},{default:n(()=>[v(" 删除 ")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])),[[le,k.value]]),e(ae,{"current-page":a.value,"onUpdate:currentPage":o[5]||(o[5]=t=>a.value=t),"page-size":f.value,"onUpdate:pageSize":o[6]||(o[6]=t=>f.value=t),"page-sizes":[5,10,15,20],background:"",layout:"->,prev,pager,next,sizes,jumper,total",total:y.value,onSizeChange:C,onCurrentChange:p},null,8,["current-page","page-size","total"])]),e(ie,{modelValue:T.value,"onUpdate:modelValue":o[7]||(o[7]=t=>T.value=t),id:B.value},null,8,["modelValue","id"])],64)}}}),qe=Ve(De,[["__scopeId","data-v-a9d3a8a0"]]);export{qe as default};
