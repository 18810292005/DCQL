var V=(i,q,g)=>new Promise((_,A)=>{var E=y=>{try{F(g.next(y))}catch(k){A(k)}},z=y=>{try{F(g.throw(y))}catch(k){A(k)}},F=y=>y.done?_(y.value):Promise.resolve(y.value).then(E,z);F((g=g.apply(i,q)).next())});import{b as fe}from"./index-DPt70WPP.js";import{ai as C,d as _e,i as p,j as ve,h as x,r as v,X as be,o as d,k as U,e as a,w as s,f as b,u as ge,ao as ye,H as ke,a as f,b as m,t as P,G as B,F as N,l as $,z as R,au as Ve,s as je,v as we,_ as he}from"./index-Dxllzmhq.js";const Ce=()=>C.get("/api/v1/account/users/?new=true"),qe=i=>C.post("/api/v1.1/storage/projects",i),ze=i=>C.patch("/api/v1.1/storage/projects",i),xe=i=>C.delete("/api/v1.1/storage/projects",{data:{id:i}}),Ue=i=>C.post("/api/v1.1/storage/subjects",i),Fe=i=>C.patch("/api/v1.1/storage/subjects",i),Me=i=>C.delete("/api/v1.1/storage/subjects",{data:{id:i}}),Y=i=>(je("data-v-2f944d77"),i=i(),we(),i),Se={class:"organizationalManagement leftTable"},Ie=Y(()=>m("div",{class:"organizationalManagement-title pl_20"},[m("div",{class:"border4"}),m("div",{class:"title"},"机构管理")],-1)),Te={class:"tree-content-style"},Le={class:"tree-content"},De=Y(()=>m("div",{class:"tips"}," 注意：上级权限负责人和管理成员将拥有所有下级非私有数据的查看权限。负责人自动成为管理成员，无需手动添加。 ",-1)),Be={class:"dialog-footer"},Ne=Y(()=>m("div",{class:"tips"}," 注意：上级权限负责人和管理成员将拥有所有下级非私有数据的查看权限。负责人自动成为管理成员，无需手动添加。 ",-1)),$e={class:"dialog-footer"},Re=_e({name:"organizationalManagement",__name:"index",setup(i){const q=p(),g=p(!1),_=t=>V(this,null,function*(){g.value=!0;let l=yield fe(t);l.code===0?(g.value=!1,q.value=A(l.data.institutes),console.log("instituteTree",q.value)):g.value=!1}),A=t=>{const l=o=>{const u={id:o.id,label:o.name,leader:o.leader,leader_fk:o.leader_fk,project_name:o.project_name||"",children:[],members:o.members||[],level:o.level,project_id:o.project_id||""};if(o.child)for(const c in o.child)u.children.push(l(o.child[c]));return u},j=[];for(const o in t)j.push(l(t[o]));return j};ve(()=>{_(),ne()});const E=p(),z=x({query:""}),F=()=>{_(z.query)},y=t=>{t&&(t.resetFields(),_())},k=p(!1),Q=p(""),M=p(!0),le=()=>{Q.value="创建",M.value=!0,k.value=!0},ae=()=>{},O=()=>{X.value.resetFields(),k.value=!1},X=p(),n=x({id:"",name:"",new_id:"",leader_name:"",members_name:[]}),te=t=>V(this,null,function*(){t&&t.validate(l=>V(this,null,function*(){l&&(M.value?(yield qe(n)).code===0&&(R({type:"success",message:"添加成功"}),O(),_()):(n.new_id=n.id,n.id=G.value,(yield ze(n)).code===0&&(R({type:"success",message:"修改成功"}),O(),_())))}))}),se=x({id:[{required:!0,message:"一级机编号称不能为空",trigger:"blur"}],name:[{required:!0,message:"一级机构名称不能为空",trigger:"blur"}],leader_name:[{required:!0,message:"负责人不能为空",trigger:"change"}],members_name:[{required:!0,message:"一级机构管理成员不能为空",trigger:"change"}]}),re={children:"children",label:"label"},oe=t=>V(this,null,function*(){Ve.confirm("确定要删除该机构吗？","删除机构",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>V(this,null,function*(){(t.data.level===1?yield xe(t.data.id):yield Me(t.data.id)).code===0&&(R({type:"success",message:"删除成功"}),_())}))}),G=p(),ie=t=>{t.data.level==1?(Q.value="编辑",M.value=!1,G.value=t.data.id,n.id=t.data.id,n.name=t.data.label,n.leader_name=t.data.leader_fk,n.members_name=t.data.members.map(l=>l.username),k.value=!0):(J.value="编辑",G.value=t.data.id,r.project_id=t.data.project_id,r.id=t.data.id,r.name=t.data.label,r.leader_name=t.data.leader_fk,r.members_name=t.data.members.map(l=>l.username),I.value=!1,S.value=!0)},h=x([]),ne=()=>V(this,null,function*(){const t=yield Ce();t.code===0&&(h.splice(0,h.length),Object.assign(h,t.data.results))}),S=p(!1),I=p(!0),J=p(""),H=()=>{K.value.resetFields(),S.value=!1},K=p(),r=x({id:"",name:"",new_id:"",project_id:"",leader_name:"",members_name:[]}),de=x({id:[{required:!0,message:"二级机编号称不能为空",trigger:"blur"}],name:[{required:!0,message:"二级机构名称不能为空",trigger:"blur"}],project_id:[{required:!0,message:"所属一级机构不能为空",trigger:"change"}]}),ue=t=>{console.log(t),J.value="添加",r.project_id=t.data.id,I.value=!0,S.value=!0},me=t=>V(this,null,function*(){t&&t.validate(l=>V(this,null,function*(){l&&(I.value?(yield Ue(r)).code===0&&(R({type:"success",message:"添加成功"}),H(),_()):(r.new_id=r.id,r.id=G.value,(yield Fe(r)).code===0&&(R({type:"success",message:"修改成功"}),H(),_())))}))});return(t,l)=>{const j=v("el-divider"),o=v("el-input"),u=v("el-form-item"),c=v("el-button"),W=v("el-form"),T=v("el-table-column"),ce=v("el-tree"),L=v("el-option"),D=v("el-select"),Z=v("el-dialog"),pe=be("loading");return d(),U("div",Se,[Ie,a(j,{class:"bt_40"}),a(W,{ref_key:"conditionFormRef",ref:E,model:z,inline:!0,"label-width":"0",size:"large"},{default:s(()=>[a(u,{label:"",prop:"query"},{default:s(()=>[a(o,{modelValue:z.query,"onUpdate:modelValue":l[0]||(l[0]=e=>z.query=e),modelModifiers:{trim:!0},placeholder:"输入机构名称",style:{width:"283px"},clearable:""},null,8,["modelValue"])]),_:1}),a(u,{label:""},{default:s(()=>[a(c,{type:"primary",onClick:F},{default:s(()=>[b("查询")]),_:1}),a(c,{onClick:l[1]||(l[1]=e=>y(E.value))},{default:s(()=>[b("重置")]),_:1}),a(c,{plain:"",type:"primary",onClick:le},{default:s(()=>[b("新增")]),_:1})]),_:1})]),_:1},8,["model"]),a(ge(ye),{style:{width:"100%"}},{default:s(()=>[a(T,{label:"编码",width:"",align:"left"}),a(T,{label:"名称",width:"200",align:"center"}),a(T,{label:"所属机构",width:"200",align:"center"}),a(T,{label:"负责人",width:"200",align:"center"}),a(T,{label:"操作",width:"200",fixed:"right",align:"center"})]),_:1}),ke((d(),f(ce,{data:q.value,props:re,"node-key":"id",draggable:"","expand-on-click-node":!1},{default:s(({node:e,data:w})=>[m("div",Te,[m("div",null,P(e.data.id),1),m("div",Le,[m("div",null,P(e.data.label),1),m("div",null,P(e.data.project_name),1),m("div",null,P(e.data.leader),1),m("div",null,[e.data.level==1?(d(),f(c,{key:0,link:"",type:"primary",size:"small",onClick:ee=>ue(e)},{default:s(()=>[b(" 添加二级机构 ")]),_:2},1032,["onClick"])):B("",!0),a(c,{link:"",type:"primary",size:"small",onClick:ee=>ie(e)},{default:s(()=>[b(" 编辑 ")]),_:2},1032,["onClick"]),a(c,{link:"",type:"danger",size:"small",onClick:ee=>oe(e)},{default:s(()=>[b(" 删除 ")]),_:2},1032,["onClick"])])])])]),_:1},8,["data"])),[[pe,g.value]]),a(Z,{modal:"","close-on-click-modal":!1,modelValue:k.value,"onUpdate:modelValue":l[7]||(l[7]=e=>k.value=e),title:Q.value,width:"900","align-center":"","destroy-on-close":"",onClose:O,onOpen:ae},{footer:s(()=>[m("div",Be,[a(c,{onClick:O,size:"large"},{default:s(()=>[b("取消")]),_:1}),a(c,{type:"primary",size:"large",onClick:l[6]||(l[6]=e=>te(X.value))},{default:s(()=>[b(" 确定 ")]),_:1})])]),default:s(()=>[a(W,{ref_key:"firstLevelInstitutionsFormRef",ref:X,model:n,"status-icon":"",rules:se,"label-width":"auto",size:"large","label-suffix":":"},{default:s(()=>[a(u,{label:"一级机构编号",prop:"id"},{default:s(()=>[a(o,{modelValue:n.id,"onUpdate:modelValue":l[2]||(l[2]=e=>n.id=e),modelModifiers:{trim:!0},placeholder:"请输入一级机构编号",clearable:""},null,8,["modelValue"])]),_:1}),a(u,{label:"一级机构名称",prop:"name"},{default:s(()=>[a(o,{modelValue:n.name,"onUpdate:modelValue":l[3]||(l[3]=e=>n.name=e),modelModifiers:{trim:!0},placeholder:"请输入一级机构名称",clearable:""},null,8,["modelValue"])]),_:1}),M.value?B("",!0):(d(),f(u,{key:0,label:"选择负责人",prop:"leader_name"},{default:s(()=>[a(D,{filterable:"",modelValue:n.leader_name,"onUpdate:modelValue":l[4]||(l[4]=e=>n.leader_name=e),modelModifiers:{trim:!0},placeholder:"请选择负责人",size:"large"},{default:s(()=>[(d(!0),U(N,null,$(h,(e,w)=>(d(),f(L,{key:w,label:e.user.real_name,value:e.user.username},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})),M.value?B("",!0):(d(),f(u,{key:1,label:"选择一级机构管理成员",prop:"members_name"},{default:s(()=>[a(D,{filterable:"",modelValue:n.members_name,"onUpdate:modelValue":l[5]||(l[5]=e=>n.members_name=e),modelModifiers:{trim:!0},placeholder:"请选择一级机构管理成员",multiple:"",size:"large"},{default:s(()=>[(d(!0),U(N,null,$(h,(e,w)=>(d(),f(L,{key:w,label:e.user.real_name,value:e.user.username},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),De]),_:1}))]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"]),a(Z,{modal:"","close-on-click-modal":!1,modelValue:S.value,"onUpdate:modelValue":l[14]||(l[14]=e=>S.value=e),title:J.value,width:"900","align-center":"","destroy-on-close":"",onClose:H},{footer:s(()=>[m("div",$e,[a(c,{onClick:H,size:"large"},{default:s(()=>[b("取消")]),_:1}),a(c,{type:"primary",onClick:l[13]||(l[13]=e=>me(K.value)),size:"large"},{default:s(()=>[b(" 确定 ")]),_:1})])]),default:s(()=>[a(W,{ref_key:"SubjectsFormRef",ref:K,style:{"max-width":"900px"},model:r,"status-icon":"",rules:de,"label-width":"auto",size:"large","label-suffix":":"},{default:s(()=>[a(u,{label:"所属一级机构",prop:"project_id"},{default:s(()=>[a(D,{filterable:"",modelValue:r.project_id,"onUpdate:modelValue":l[8]||(l[8]=e=>r.project_id=e),placeholder:"请选择所属一级机构",size:"large"},{default:s(()=>[(d(!0),U(N,null,$(q.value,e=>(d(),f(L,{key:e.id,label:e.label,value:e.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),a(u,{label:"二级机构编号",prop:"id"},{default:s(()=>[a(o,{modelValue:r.id,"onUpdate:modelValue":l[9]||(l[9]=e=>r.id=e),modelModifiers:{trim:!0},placeholder:"请输入二级机构编号",clearable:""},null,8,["modelValue"])]),_:1}),a(u,{label:"二级机构名称",prop:"name"},{default:s(()=>[a(o,{modelValue:r.name,"onUpdate:modelValue":l[10]||(l[10]=e=>r.name=e),modelModifiers:{trim:!0},placeholder:"请输入二级机构名称",clearable:""},null,8,["modelValue"])]),_:1}),I.value?B("",!0):(d(),f(u,{key:0,label:"选择负责人",prop:"leader_name"},{default:s(()=>[a(D,{filterable:"",modelValue:r.leader_name,"onUpdate:modelValue":l[11]||(l[11]=e=>r.leader_name=e),placeholder:"请选择负责人",size:"large"},{default:s(()=>[(d(!0),U(N,null,$(h,(e,w)=>(d(),f(L,{key:w,label:e.user.real_name,value:e.user.username},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1})),I.value?B("",!0):(d(),f(u,{key:1,label:"选择二级机构管理成员",prop:"members_name"},{default:s(()=>[a(D,{filterable:"",modelValue:r.members_name,"onUpdate:modelValue":l[12]||(l[12]=e=>r.members_name=e),placeholder:"请选择二级机构管理成员",multiple:"",size:"large"},{default:s(()=>[(d(!0),U(N,null,$(h,(e,w)=>(d(),f(L,{key:w,label:e.user.real_name,value:e.user.username},null,8,["label","value"]))),128))]),_:1},8,["modelValue"]),Ne]),_:1}))]),_:1},8,["model","rules"])]),_:1},8,["modelValue","title"])])}}}),Ge=he(Re,[["__scopeId","data-v-2f944d77"]]);export{Ge as default};