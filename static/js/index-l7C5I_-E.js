var x=(l,r,c)=>new Promise((v,b)=>{var i=a=>{try{d(c.next(a))}catch(t){b(t)}},g=a=>{try{d(c.throw(a))}catch(t){b(t)}},d=a=>a.done?v(a.value):Promise.resolve(a.value).then(i,g);d((c=c.apply(l,r)).next())});import{ai as B,d as O,i as p,aj as W,ak as G,j as H,al as L,h as M,r as n,X as R,o as w,k as T,b as e,e as s,u as X,am as $,w as m,F as z,l as J,a as q,f as P,m as Q,t as h,H as Y,an as Z,s as ee,v as te,_ as ae}from"./index-Dxllzmhq.js";const se=()=>B.get("/api/v1/analytics/statistics_count"),le=l=>B.get("/api/v1/analytics/top_templates/"+l),_=l=>(ee("data-v-732eefae"),l=l(),te(),l),oe={class:"home"},ne={class:"home-content"},ce={class:"home-header"},ie={class:"home-search"},de={class:"home-data"},ue={class:"mb10 fs28"},_e=_(()=>e("div",null,"分类",-1)),re={class:"mb10 fs28"},ve=_(()=>e("div",null,"数据量",-1)),pe={class:"mb10 fs28"},me=_(()=>e("div",null,"模板量",-1)),he={class:"mb10 fs28"},be=_(()=>e("div",null,"访问量",-1)),ge={class:"mb10 fs28"},fe=_(()=>e("div",null,"用户量",-1)),ye={class:"home-table"},we=_(()=>e("div",{class:"table-title"},[e("div",{class:"border4"}),e("div",{class:"title"},"热门数据")],-1)),xe={class:"table-data"},Se=O({name:"home",__name:"index",setup(l){const r=p(!1);W();const c=G();H(()=>{L("logo","https://mgetest.micl.com.cn/api/v1/service/logo/navbar"),L("logoLogin","https://mgetest.micl.com.cn/api/v1/service/logo/login"),a(),I()});const v=p("0"),b=M([{value:"0",label:"全文检索"},{value:"1",label:"数据名称"},{value:"2",label:"摘要"},{value:"3",label:"上传人"},{value:"4",label:"关键词"}]),i=p(""),g=()=>{i.value&&c.push({name:"search",query:{type:v.value,search:i.value}})},d=p(),a=()=>x(this,null,function*(){r.value=!0;const u=yield le(10);u.code===0&&(d.value=u.data),r.value=!1}),t=p(),I=()=>x(this,null,function*(){const u=yield se();u.code===0&&(t.value=u.data)});return(u,f)=>{var S,V,k,C,D;const A=n("el-image"),E=n("el-option"),F=n("el-select"),N=n("el-button"),U=n("el-input"),y=n("el-table-column"),j=n("el-table"),K=R("loading");return w(),T("div",oe,[e("div",ne,[e("div",ce,[s(A,{src:X($)("logo"),style:{height:"110px"}},null,8,["src"])]),e("div",ie,[s(U,{modelValue:i.value,"onUpdate:modelValue":f[1]||(f[1]=o=>i.value=o),placeholder:"输入检索内容",style:{height:"70px"},onKeyup:Q(g,["enter"])},{prepend:m(()=>[s(F,{modelValue:v.value,"onUpdate:modelValue":f[0]||(f[0]=o=>v.value=o),style:{width:"100px",height:"70px"}},{default:m(()=>[(w(!0),T(z,null,J(b,o=>(w(),q(E,{key:o.value,label:o.label,value:o.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),append:m(()=>[s(N,{class:"search-btn",type:"success",onClick:g},{default:m(()=>[P(" 搜索 ")]),_:1})]),_:1},8,["modelValue"])]),e("div",de,[e("div",null,[e("div",ue,h((S=t.value)==null?void 0:S.num_category),1),_e]),e("div",null,[e("div",re,h((V=t.value)==null?void 0:V.num_data),1),ve]),e("div",null,[e("div",pe,h((k=t.value)==null?void 0:k.num_template),1),me]),e("div",null,[e("div",he,h((C=t.value)==null?void 0:C.num_downloads)+"W ",1),be]),e("div",null,[e("div",ge,h((D=t.value)==null?void 0:D.num_user)+"W",1),fe])]),e("div",ye,[we,e("div",xe,[Y((w(),q(j,{data:d.value,style:{width:"100%"}},{default:m(()=>[s(y,{label:"序号",type:"index",index:1,width:"180",align:"center",fit:""}),s(y,{prop:"category",label:"分类",align:"center",width:"300"}),s(y,{prop:"title",label:"模板名称",align:"center",width:"300"}),s(y,{prop:"num_data",label:"数据量",align:"center",width:"300"})]),_:1},8,["data"])),[[K,r.value]])])]),s(Z,{bgColor:"transparent"})])])}}}),Ce=ae(Se,[["__scopeId","data-v-732eefae"]]);export{Ce as default};