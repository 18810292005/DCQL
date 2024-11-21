from apps.nql.grammar.MysqlQueryParser import MysqlQueryParser
from apps.nql.grammar.MysqlQueryVisitor import MysqlQueryVisitor
from apps.nql.logicplan.LogicalPlanNode import ColumnName, Function, op_mapping, ComparisonExpression, LogicalExpression, \
    TemplateName, \
    ScanLogicPlan, FilterLogicPlan, SchemaLogicPlan, Limit, OrderBy, GroupBy

class NQLVisitor(MysqlQueryVisitor):

    def visitSelectStatement(self, ctx):
        '''
        SELECT 语句
        '''
        select_elements = template_source = where_conditions = group_by = having = order = limit = None
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.SelectElementsContext):
                select_elements = self.visitSelectElements(l)
                # print(select_elements)
            elif isinstance(l, MysqlQueryParser.TableSourcesContext):
                template_source = self.visitTableSources(l)
            elif isinstance(l, MysqlQueryParser.WhereClauseContext):
                where_conditions = self.visitWhereClause(l)
            elif isinstance(l, MysqlQueryParser.GroupByCaluseContext):
                group_by = self.visitGroupByCaluse(l)
            elif isinstance(l, MysqlQueryParser.HavingCaluseContext):
                having = self.visitHavingCaluse(l)
            elif isinstance(l, MysqlQueryParser.OrderByClauseContext):
                order = self.visitOrderByClause(l)
            elif isinstance(l, MysqlQueryParser.LimitClauseContext):
                limit = self.visitLimitClause(l)
        scan = ScanLogicPlan(template_source=template_source,
                             where_conditions=where_conditions,
                             group_by=group_by,
                             having=having,
                             order=order,
                             limit=limit)
        filter = FilterLogicPlan(select_elements=select_elements, template_source=template_source,where_conditions=where_conditions,
                                 group_by=group_by,
                                 having=having,
                                 order=order,
                                 limit=limit)
        filter.children.append(scan)
        return filter
    '''control语句'''
    def visitControlStatement(self, ctx:MysqlQueryParser.ControlStatementContext):
        control_elements = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Create_roleContext):
                control_elements.append((self.visitCreate_role(l)))
            elif isinstance(l, MysqlQueryParser.Drop_roleContext):
                control_elements.append(self.visitDrop_role(l))
            elif isinstance(l, MysqlQueryParser.Rename_roleContext):
                control_elements.append(self.visitRename_role(l))
            elif isinstance(l, MysqlQueryParser.Grant_privilege_to_roleContext):
                control_elements.append(self.visitGrant_privilege_to_role(l))
            elif isinstance(l, MysqlQueryParser.Revoke_privilege_from_roleContext):
                control_elements.append(self.visitRevoke_privilege_from_role(l))
            elif isinstance(l, MysqlQueryParser.Show_roleContext):
                control_elements.append(self.visitShow_role(l))
            elif isinstance(l, MysqlQueryParser.Create_userContext):
                control_elements.append(self.visitCreate_user(l))
            elif isinstance(l, MysqlQueryParser.Drop_userContext):
                control_elements.append(self.visitDrop_user(l))
            elif isinstance(l, MysqlQueryParser.Rename_userContext):
                control_elements.append(self.visitRename_user(l))
            elif isinstance(l, MysqlQueryParser.Update_user_passwordContext):
                control_elements.append(self.visitUpdate_user_password(l))
            elif isinstance(l, MysqlQueryParser.Grant_role_to_userContext):
                control_elements.append(self.visitGrant_role_to_user(l))
            elif isinstance(l, MysqlQueryParser.Revoke_role_from_userContext):
                control_elements.append(self.visitRevoke_role_from_user(l))
            elif isinstance(l, MysqlQueryParser.Show_userContext):
                control_elements.append(self.visitShow_user(l))
        return SchemaLogicPlan(control_elements=control_elements)
    '''show user'''
    def visitShow_user(self, ctx:MysqlQueryParser.Show_userContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''Update_user_password'''
    def visitUpdate_user_password(self, ctx:MysqlQueryParser.Update_user_passwordContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            elif isinstance(i, MysqlQueryParser.PasswordContext):
                user.append(str(self.visitPassword(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''Grant_role_to_user'''
    def visitGrant_role_to_user(self, ctx:MysqlQueryParser.Grant_role_to_userContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                user.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''Revoke_role_from_user'''
    def visitRevoke_role_from_user(self, ctx:MysqlQueryParser.Revoke_role_from_userContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                user.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''create user'''
    def visitCreate_user(self, ctx:MysqlQueryParser.Create_userContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                user.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            elif isinstance(i, MysqlQueryParser.PasswordContext):
                user.append(str(self.visitPassword(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''drop user'''
    def visitDrop_user(self, ctx:MysqlQueryParser.Drop_userContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''rename user'''
    def visitRename_user(self, ctx:MysqlQueryParser.Rename_userContext):
        user = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.User_nameContext):
                user.append(str(self.visitUser_name(i)))
            else:
                st = str(i)
                if st != ",":
                    user.append(st)
        return user
    '''show role'''
    def visitShow_role(self, ctx:MysqlQueryParser.Show_roleContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.PrivilegeContext):
                role.append(str(self.visitPrivilege(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role
    '''revoke v from role'''
    def visitRevoke_privilege_from_role(self, ctx:MysqlQueryParser.Revoke_privilege_from_roleContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.PrivilegeContext):
                role.append(str(self.visitPrivilege(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role
    '''grant v to role'''
    def visitGrant_privilege_to_role(self, ctx:MysqlQueryParser.Grant_privilege_to_roleContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.PrivilegeContext):
                role.append(str(self.visitPrivilege(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role
    '''rename role'''
    def visitRename_role(self, ctx:MysqlQueryParser.Rename_roleContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role
    '''create role'''
    def visitCreate_role(self, ctx:MysqlQueryParser.Create_roleContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.PrivilegeContext):
                role.append(str(self.visitPrivilege(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role

    def visitPrivilege(self, ctx:MysqlQueryParser.PrivilegeContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.ActionContext):
                role.append(str(self.visitAction(i)))
            elif isinstance(i, MysqlQueryParser.ResourceContext):
                role.append(str(self.visitResource(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role

    def visitAction(self, ctx:MysqlQueryParser.ActionContext):
        return ctx.getChild(0)

    def visitResource(self, ctx:MysqlQueryParser.ResourceContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.TemplateNameContext):
                role.append(str(self.visitTemplateName(i)))
            elif isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            elif isinstance(i, MysqlQueryParser.User_nameContext):
                role.append(str(self.visitUser_name(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role
    '''drop role'''
    def visitDrop_role(self, ctx:MysqlQueryParser.Drop_roleContext):
        role = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Role_nameContext):
                role.append(str(self.visitRole_name(i)))
            else:
                st = str(i)
                if st != ",":
                    role.append(st)
        return role

    def visitRole_name(self, ctx:MysqlQueryParser.Role_nameContext):
        return ctx.getChild(0)

    def visitUser_name(self, ctx:MysqlQueryParser.User_nameContext):
        return ctx.getChild(0)

    def visitPassword(self, ctx:MysqlQueryParser.PasswordContext):
        return ctx.getChild(0)
    '''ALTER语句'''
    def visitAlterStatement(self, ctx:MysqlQueryParser.AlterStatementContext):
        template = []
        alter_elements = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(self.visitTemplateName(l))
            elif isinstance(l, MysqlQueryParser.AlterStatementsContext):
                #alter_elements=self.visitAlterStatements(l)
                alter_elements.append(self.visitAlterStatements(l))
        return SchemaLogicPlan(template_source=template,alter_elements=alter_elements)

    def visitAlterStatements(self, ctx:MysqlQueryParser.AlterStatementsContext):
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Add_contentContext):
                #alter.append(self.visitAdd_content(l))
                return self.visitAdd_content(l)
            elif isinstance(l, MysqlQueryParser.Drop_contentContext):
                #alter.append(self.visitDrop_content(l))
                return self.visitDrop_content(l)
            elif isinstance(l, MysqlQueryParser.Alter_contentContext):
                #alter.append(self.visitAlter_content(l))
                return self.visitAlter_content(l)

    def visitAdd_content(self, ctx:MysqlQueryParser.Add_contentContext):
        e = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Add_contentsContext):
                e.append(self.visitAdd_contents(l))
            elif str(l) == 'add' :
                e.append(str(l))
        return e

    def visitDrop_content(self, ctx:MysqlQueryParser.Drop_contentContext):
        e = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Drop_contentsContext):
                e.append(self.visitDrop_contents(l))
            elif str(l) == 'drop' :
                e.append(str(l))
        return e

    def visitDrop_contents(self, ctx:MysqlQueryParser.Drop_contentsContext):
        e = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Column_nameContext):
                e.append(str(self.visitColumn_name(l)))
            elif isinstance(l,MysqlQueryParser.Choice_typeContext):
                e.append(self.visitChoice_type(l))
            elif isinstance(l,MysqlQueryParser.Choice_group_typeContext):
                e.append(self.visitChoice_group_type(l))
            try:
                if isinstance(l,MysqlQueryParser.UnitContext) and not isinstance(l,type(None)):
                    e.append(str(l.getChild(0)))
                    e.append(str(l.getChild(1).getChild(0)))
                    e.append(str(l.getChild(2)))
            except TypeError:
                pass
        return e

    def visitAlter_content(self, ctx:MysqlQueryParser.Alter_contentContext):
        e = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Alter_contentsContext):
                e.append(self.visitAlter_contents(l))
            elif str(l) == 'alter' :
                e.append(str(l))
        return e

    def visitAlter_contents(self, ctx:MysqlQueryParser.Alter_contentsContext):
        e = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Column_nameContext):
                e.append(str(self.visitColumn_name(l)))
            elif isinstance(l,MysqlQueryParser.Choice_typeContext):
                e.append(self.visitChoice_type(l))
            elif isinstance(l,MysqlQueryParser.Choice_group_typeContext):
                e.append(self.visitChoice_group_type(l))
            elif isinstance(l,MysqlQueryParser.UnitContext):
                e.append('unit')
                e.append(str(l.getChild(0)))
                e.append(str(l.getChild(1).getChild(0)))
                e.append(str(l.getChild(2)))
        return e
    '''update语句'''
    def visitUpdateStatement(self, ctx:MysqlQueryParser.UpdateStatementContext):
        template = []
        where_conditions = None
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(str(self.visitTemplateName(l)))
            elif isinstance(l, MysqlQueryParser.Column_nameContext):
                template.append(str(self.visitColumn_name(l)))
            elif isinstance(l, MysqlQueryParser.ValueContext):
                template.append(self.visitValue(l))
            elif isinstance(l, MysqlQueryParser.WhereClauseContext):
                where_conditions = self.visitWhereClause(l)
        return ScanLogicPlan(template_source=template,where_conditions=where_conditions)

    def visitDeleteStatement(self, ctx:MysqlQueryParser.DeleteStatementContext):
        template = []

        where_conditions = None
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(self.visitTemplateName(l))
            elif isinstance(l, MysqlQueryParser.WhereClauseContext):
                where_conditions = self.visitWhereClause(l)
        return SchemaLogicPlan(template_source=template,where_conditions=where_conditions,type_elements='delete')

    def visitDescribeStatement(self, ctx: MysqlQueryParser.DescribeStatementContext):
        template = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(self.visitTemplateName(l))
        return SchemaLogicPlan(template_source=template,type_elements='describe')

    def visitDropStatement(self, ctx:MysqlQueryParser.DropStatementContext):
        template = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(self.visitTemplateName(l))
        return SchemaLogicPlan(template_source=template,type_elements='drop')

    def visitCreateStatement(self, ctx:MysqlQueryParser.CreateStatementContext):
        template = []
        create_elements = []
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(str(self.visitTemplateName(l)))
            if isinstance(l, MysqlQueryParser.Create_all_typeContext):
                create_elements.append(self.visitChildren(l))
        return SchemaLogicPlan(template_source=template,create_elements=create_elements)
    '''
    insert
    '''
    def visitInsertStatement(self, ctx:MysqlQueryParser.InsertStatementContext):
        template = []
        te = []
        insert_elements = []
        co = False
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.TemplateNameContext):
                template.append(self.visitTemplateName(l))
            if isinstance(l, MysqlQueryParser.Column_nameContext):
                co = True
                te.append(str(self.visitColumn_name(l)))
            if isinstance(l, MysqlQueryParser.Insert_all_valuesContext):
                insert_elements.append(self.visitInsert_all_values(l))
        if co == True:
            insert_elements.insert(0,te)
        return SchemaLogicPlan(template_source=template,insert_elements=insert_elements)

    def visitInsert_all_values(self, ctx:MysqlQueryParser.Insert_all_valuesContext):
        for l in ctx.children:
            if isinstance(l, MysqlQueryParser.Insert_all_valueContext):
                return self.visitInsert_all_value(l)

    def visitInsert_file_value(self, ctx:MysqlQueryParser.Insert_file_valueContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.PathTextContext):
                elements.append(str(self.visitPathText(i))[1:-1])
            elif str(i)!='(' and str(i)!=')' and str(i)!=',':
                elements.append(str(i))
        return elements

    def visitInsert_image_value(self, ctx:MysqlQueryParser.Insert_image_valueContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.PathTextContext):
                elements.append(str(self.visitPathText(i))[1:-1])
            elif str(i) != '(' and str(i) != ')' and str(i) != ',':
                elements.append(str(i))
        return elements

    def visitInsert_string_value(self, ctx:MysqlQueryParser.Insert_string_valueContext):
        elements = []
        elements.append("string")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.ValueContext):
                elements.append(str(self.visitValue(i)))
        return elements

    def visitInsert_number_value(self, ctx:MysqlQueryParser.Insert_number_valueContext):
        elements = []
        elements.append("number")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.DecimalLiteralContext):
                elements.append(str(self.visitDecimalLiteral(i)))
        return elements

    def visitInsert_range_value(self, ctx:MysqlQueryParser.Insert_range_valueContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.DecimalLiteralContext):
                elements.append(str(self.visitDecimalLiteral(i)))
            else:
                st = str(i)
                if st != "," and st!='(' and st!=')':
                    elements.append(st)
        return elements

    def visitInsert_choice_value(self, ctx:MysqlQueryParser.Insert_choice_valueContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Option_group_nameContext):
                elements.append(str(self.visitOption_group_name(i)))
            elif isinstance(i, MysqlQueryParser.Option_nameContext):
                elements.append(str(self.visitOption_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitInsert_table_value(self, ctx:MysqlQueryParser.Insert_table_valueContext):
        elements = []
        column = []
        elements.append("table")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Table_rowContext):
                elements.append((self.visitTable_row(i)))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                column.append(str(self.visitColumn_name(i)))
        elements.append(column)
        return elements

    def visitTable_row(self, ctx:MysqlQueryParser.Table_rowContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_unnested_valueContext):
                elements.append(self.visitInsert_unnested_value(i))
        return elements
    '''
     innsert container
     '''
    def visitInsert_container_value(self, ctx:MysqlQueryParser.Insert_container_valueContext):
        elements = []
        column = []
        elements.append("container")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Container_elementContext):
                elements.append((self.visitContainer_element(i)))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                column.append(str(self.visitColumn_name(i)))
        elements.append(column)
        return elements
    '''
    innsert generator
    '''
    def visitInsert_generator_value(self, ctx:MysqlQueryParser.Insert_generator_valueContext):
        elements = []
        column = []
        elements.append("generator")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Generator_elementContext):
                elements.append((self.visitGenerator_element(i)))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                column.append(str(self.visitColumn_name(i)))
        elements.append(column)
        return elements

    '''
    INSERT ARRAY
    '''
    def visitInsert_array_value(self, ctx:MysqlQueryParser.Insert_array_valueContext):
        elements = []
        elements.append("array")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Array_element_stringContext):
                elements.append((self.visitArray_element_string(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_numberContext):
                elements.append((self.visitArray_element_number(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_rangeContext):
                elements.append((self.visitArray_element_range(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_fileContext):
                elements.append((self.visitArray_element_file(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_imageContext):
                elements.append((self.visitArray_element_image(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_choiceContext):
                elements.append((self.visitArray_element_choice(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_tableContext):
                elements.append((self.visitArray_element_table(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_containerContext):
                elements.append((self.visitArray_element_container(i)))
            elif isinstance(i, MysqlQueryParser.Array_element_generatorContext):
                elements.append((self.visitArray_element_generator(i)))
        return elements

    def visitArray_element_string(self, ctx:MysqlQueryParser.Array_element_stringContext):
        elements = []
        elements.append("string")
        string = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_string_value_removeContext):
                string.append(str(self.visitInsert_string_value_remove(i)))
        elements.append(string)
        return elements

    def visitArray_element_number(self, ctx:MysqlQueryParser.Array_element_numberContext):
        elements = []
        elements.append("number")
        number = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_number_value_removeContext):
                number.append(str(self.visitInsert_number_value_remove(i)))
        elements.append(number)
        return elements

    def visitArray_element_range(self, ctx:MysqlQueryParser.Array_element_rangeContext):
        elements = []
        range = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_range_value_removeContext):
                range.append((self.visitInsert_range_value_remove(i)))
            elif str(i)!=',' and  str(i)!='[' and  str(i)!=']':
                elements.append(str(i))
        elements.append(range)
        return elements

    def visitArray_element_file(self, ctx:MysqlQueryParser.Array_element_fileContext):
        elements = []
        elements.append("file")
        file = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_file_value_removeContext):
                file.append((self.visitInsert_file_value_remove(i)))
        elements.append(file)
        return elements

    def visitArray_element_image(self, ctx:MysqlQueryParser.Array_element_imageContext):
        elements = []
        elements.append("image")
        image = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_image_value_removeContext):
                image.append((self.visitInsert_image_value_remove(i)))
        elements.append(image)
        return elements

    def visitInsert_file_value_remove(self, ctx:MysqlQueryParser.Insert_file_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.PathTextContext):
                el.append(str(self.visitPathText(i)))
        return el

    def visitInsert_image_value_remove(self, ctx:MysqlQueryParser.Insert_image_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.PathTextContext):
                el.append(str(self.visitPathText(i)))
        return el

    def visitInsert_string_value_remove(self, ctx:MysqlQueryParser.Insert_string_value_removeContext):
        return self.visitValue(ctx)

    def visitInsert_number_value_remove(self, ctx:MysqlQueryParser.Insert_number_value_removeContext):
        return self.visitValue(ctx)

    def visitInsert_range_value_remove(self, ctx:MysqlQueryParser.Insert_range_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.DecimalLiteralContext):
                el.append(str(self.visitDecimalLiteral(i)))
        return el

    def visitPathText(self, ctx:MysqlQueryParser.PathTextContext):
        return ctx.getChild(0)

    def visitArray_element_choice(self, ctx:MysqlQueryParser.Array_element_choiceContext):
        elements = []
        elements.append("choice")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_choice_value_removeContext):
                elements.append((self.visitInsert_choice_value_remove(i)))
        return elements

    def visitInsert_choice_value_remove(self, ctx:MysqlQueryParser.Insert_choice_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Option_nameContext):
                el.append(str(self.visitOption_name(i)))
            elif isinstance(i,MysqlQueryParser.Option_group_nameContext):
                el.append(str(self.visitOption_group_name(i)))
            else:
                st = str(i)
                if st != ",":
                    el.append(st)
        return el

    def visitArray_element_table(self, ctx:MysqlQueryParser.Array_element_tableContext):
        elements = []
        elements.append("table")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_table_value_removeContext):
                elements.append((self.visitInsert_table_value_remove(i)))
        return elements

    def visitInsert_table_value_remove(self, ctx:MysqlQueryParser.Insert_table_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Table_rowContext):
                #for j in self.visitTable_row(i):
                    #el.append(j)
                el.append((self.visitTable_row(i)))
        return el

    def visitArray_element_container(self, ctx:MysqlQueryParser.Array_element_containerContext):
        elements = []
        elements.append("container")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_container_value_removeContext):
                elements.append((self.visitInsert_container_value_remove(i)))
        return elements

    def visitInsert_container_value_remove(self, ctx:MysqlQueryParser.Insert_container_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Container_elementContext):
                el.append((self.visitContainer_element(i)))
        return el

    def visitArray_element_generator(self, ctx:MysqlQueryParser.Array_element_generatorContext):
        elements = []
        elements.append("generator")
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Insert_generator_value_removeContext):
                elements.append((self.visitInsert_generator_value_remove(i)))
        return elements

    def visitInsert_generator_value_remove(self, ctx:MysqlQueryParser.Insert_generator_value_removeContext):
        el = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Generator_elementContext):
                el.append((self.visitGenerator_element(i)))
        return el
    '''
    create
    '''
    def visitCreate_container_type(self, ctx:MysqlQueryParser.Create_container_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Create_all_typeContext):
                elements.append(self.visitCreate_all_type(i))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                elements.append(str(i))
        return elements

    def visitCreate_string_type(self, ctx:MysqlQueryParser.Create_string_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitCreate_number_type(self, ctx:MysqlQueryParser.Create_number_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            elif isinstance(i, MysqlQueryParser.Unit_nameContext):
                elements.append(str(self.visitUnit_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitCreate_range_type(self, ctx:MysqlQueryParser.Create_range_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            elif isinstance(i, MysqlQueryParser.Unit_nameContext):
                elements.append(str(self.visitUnit_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitCreate_image_type(self, ctx:MysqlQueryParser.Create_image_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitCreate_file_type(self, ctx:MysqlQueryParser.Create_file_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitCreate_choice_type(self, ctx:MysqlQueryParser.Create_choice_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            elif isinstance(i, MysqlQueryParser.Choice_typeContext):
                for i in self.visitChoice_type(i):
                    elements.append(i)
                #elements.append((self.visitChoice_type(i)))
            elif isinstance(i, MysqlQueryParser.Choice_group_typeContext):
                #elements.append((self.visitChoice_group_type(i)))
                for i in self.visitChoice_group_type(i):
                    elements.append(i)
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitUnit_name(self, ctx:MysqlQueryParser.Unit_nameContext):
        return ctx.getChild(0)

    def visitChoice_type(self, ctx:MysqlQueryParser.Choice_typeContext):
        val = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Option_nameContext):
                val.append(str(self.visitOption_name(i)))
            else:
                st = str(i)
                if st != ",":
                    val.append(st)
        return val

    def visitChoice_group_type(self, ctx:MysqlQueryParser.Choice_group_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Choice_type_removeContext):
                #for i in self.visitChoice_type_remove(i):
                    #elements.append(i)
                elements.append((self.visitChoice_type_remove(i)))
            elif isinstance(i, MysqlQueryParser.Option_nameContext):
                elements.append(str(self.visitOption_name(i)))
            else:
                st = str(i)
                if st != "," and st!= '[' and st!= ']':
                    elements.append(st)
        #print(elements)
        return elements

    def visitChoice_type_remove(self, ctx:MysqlQueryParser.Choice_type_removeContext):
        val = []
        option = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Option_nameContext):
                option.append(str(self.visitOption_name(i)))
            elif isinstance(i, MysqlQueryParser.Option_group_nameContext):
                val.append(str(self.visitOption_group_name(i)))
            else:
                st = str(i)
                if st != "," and st!= '[' and st!= ']':
                    val.append(st)
        val.append(option)
        return val

    def visitOption_name(self, ctx:MysqlQueryParser.Option_nameContext):
        return str(ctx.getChild(0))

    def visitOption_group_name(self, ctx:MysqlQueryParser.Option_group_nameContext):
        return str(ctx.getChild(0))

    def visitCreate_table_type(self, ctx:MysqlQueryParser.Create_table_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Create_unnested_typeContext):
                elements.append(self.visitCreate_unnested_type(i))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                elements.append(str(i))
        return elements

    def visitCreate_generator_type(self, ctx:MysqlQueryParser.Create_generator_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Generator_typeContext):
                elements.append(self.visitGenerator_type(i))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                elements.append(str(i))
        return elements

    def visitCreate_array_type(self, ctx:MysqlQueryParser.Create_array_typeContext):
        elements = []
        for i in ctx.children:
            if isinstance(i, MysqlQueryParser.Array_typeContext):
                elements.append(self.visitArray_type(i))
            elif isinstance(i, MysqlQueryParser.Column_nameContext):
                elements.append(str(self.visitColumn_name(i)))
            else:
                st = str(i)
                if st != ",":
                    elements.append(st)
        return elements

    def visitArray_type(self, ctx:MysqlQueryParser.Array_typeContext):
        elements = []
        len = ctx.getChildCount()
        for i in range(len):
            if isinstance(ctx.getChild(i), MysqlQueryParser.UnitContext):
                elements.append(self.visitUnit_name(ctx.getChild(i)))
            elif isinstance(ctx.getChild(i), MysqlQueryParser.Unit_nameContext):
                elements.append(str(self.visitUnit_name(ctx.getChild(i))))
            elif isinstance(ctx.getChild(i), MysqlQueryParser.Choice_typeContext):
                for item in self.visitChoice_type(ctx.getChild(i)):
                    elements.append(item)
                #elements.append(self.visitChoice_type(ctx.getChild(i)))
            elif isinstance(ctx.getChild(i), MysqlQueryParser.Choice_group_typeContext):
                for item in self.visitChoice_group_type(ctx.getChild(i)):
                    elements.append(item)
                #elements.append(self.visitChoice_group_type(ctx.getChild(i)))
            elif isinstance(ctx.getChild(i), MysqlQueryParser.Create_unnested_typeContext):
                elements.append(self.visitCreate_unnested_type(ctx.getChild(i)))
            elif isinstance(ctx.getChild(i), MysqlQueryParser.Create_all_typeContext):
                elements.append(self.visitCreate_all_type(ctx.getChild(i)))
            elif isinstance(ctx.getChild(i), MysqlQueryParser.Generator_typeContext):
                elements.append(self.visitGenerator_type(ctx.getChild(i)))
            else:
                elements.append(str(ctx.getChild(i)))
        return elements
    '''
    ELEMENT字句解析
    '''

    def visitSelectElements(self, ctx):
        elements = []
        op = str(ctx.getChild(0))
        if op == "distinct":
            a=ColumnName(op)
            elements.append(a)
        for element in ctx.children:
            if str(element) == '*':
                elements.append(str(element))
            elif isinstance(element, MysqlQueryParser.SelectColumnElementContext):
                elements.append(self.visitSelectColumnElement(element))
            elif isinstance(element, MysqlQueryParser.SelectFunctionElementContext):
                e = element.getChild(0).getChild(0)
                cou = e.getChildCount()
                if cou>4 :
                    s1 = e.getChild(3).getChildCount()
                    n1 = " "
                    elements.append(Function(str(e.getChild(0))))
                    elements.append(Function(str(e.getChild(1))))
                    elements.append(Function(str(e.getChild(2))))
                    for i in range(s1):
                        if i%2 == 0:
                            elements.append(Function(str(e.getChild(3).getChild(i).getChild(0))))
                        else:
                            elements.append(Function(str(e.getChild(3).getChild(i))))
                    elements.append(Function(str(e.getChild(4))))
                else:
                    elements.append(Function(str(e.getChild(0))))
                    elements.append(Function(str(e.getChild(1))))
                    elements.append(Function(str(e.getChild(2).getChild(0).getChild(0))))
                    elements.append(Function(str(e.getChild(3))))
                #elements.append(self.visitSelectFunctionElement(element))
        return elements

    def visitSelectColumnElement(self, ctx):
        column_element = self.visitChildren(ctx)
        return column_element

    def visitSelectFunctionElement(self, ctx):
        function_element = self.visitChildren(ctx)
        return function_element

    '''
    limti字句解析
    '''

    def visitLimitClause(self, ctx):
        limit_context = getattr(ctx, "limit", None)
        if limit_context is not None:
            limit = str(self.visit(limit_context))
        else:
            limit = 50
        offset_context = getattr(ctx, "offset", 0)
        if offset_context is not None:
            offset = str(self.visit(offset_context))
        else:
            offset = 0
        res = Limit(limit=limit, offset=offset)
        return res

    '''
    order,group字句解析
    '''

    def visitOrderByClause(self, ctx):
        for element in ctx.children:
            if isinstance(element, MysqlQueryParser.OrderByExpressionContext):
                title = (element.start.text)
                order = str(element.order.text)
                item = OrderBy(title=title, order=order)
        return item

    def visitGroupByCaluse(self, ctx):
        for element in ctx.children:
            if isinstance(element, MysqlQueryParser.GroupByItemContext):
                title = (element.start.text)
                order = str(element.order.text)
                item = GroupBy(title=title, order=order)
        return item

    '''
    FROM字句的相关处理
    '''
    def visitTableSources(self, ctx):
        tables = []
        for l in ctx.children:
            if isinstance(l,MysqlQueryParser.TemplateNameContext):
                tables.append(self.visitTemplateName(l))
        #tables = self.visitChildren(ctx)
        return tables
    '''
    describe字句的相关处理
    '''
    def visitTemplateName(self, ctx:MysqlQueryParser.TemplateNameContext):
        return TemplateName(str(ctx.getChild(0)))

    '''
    where字句的解析
    '''
    def visitFullColumnName(self, ctx):
        columns = self.visitChildren(ctx)
        return columns

    def visitColumn_name(self, ctx):
        n = ctx.getChildCount()
        val = ""
        for i in range(n):
            if not isinstance(ctx.getChild(i), MysqlQueryParser.DecimalLiteralContext):
                val += str(ctx.getChild(i))
            else:
                val += str(ctx.getChild(i).getChild(0))
        val = ColumnName(val)
        return val
    
    def visitAggregateWindowedFunction(self, ctx):
        n = ctx.getChildCount()
        val = ""
        for i in range(n):
            val += str(ctx.getChild(i))
        val = Function(val)
        return val

    def visitComparisonOperator(self, ctx: MysqlQueryParser.ComparisonOperatorContext):
        n = ctx.getChildCount()
        val = ""
        for i in range(n):
            val += str(ctx.getChild(i))
        origin_op = str(val)
        op = op_mapping.get(origin_op, None)
        return op

    def visitValue(self, ctx: MysqlQueryParser.ValueContext):
        val = self.visitChildren(ctx)
        return val

    def visitUid(self, ctx: MysqlQueryParser.UidContext):
        return str(ctx.getChild(0))

    def visitTextLiteral(self, ctx: MysqlQueryParser.TextLiteralContext):
        return str(ctx.getChild(0))

    def visitDecimalLiteral(self, ctx: MysqlQueryParser.DecimalLiteralContext):
        return str(ctx.getChild(0))

    def visitWhereClause(self, ctx):
        conditions = self.visitChildren(ctx)
        return conditions

    def visitHavingCaluse(self, ctx):
        conditions = self.visitChildren(ctx)
        return conditions

    def visitLogicalOperator(self, ctx: MysqlQueryParser.LogicalOperatorContext):
        return str(ctx.getChild(0))

    def visitLogicExpression(self, ctx):
        if isinstance(ctx.getChild(1), MysqlQueryParser.LogicalOperatorContext):
            left = self.visitLogicExpression(ctx.getChild(0))
            op = self.visitLogicalOperator(ctx.getChild(1))
            right = self.visitLogicExpression(ctx.getChild(2))
            expression = LogicalExpression(left=left, op=op, right=right)
            return expression
        else:
            return self.visitChildren(ctx)

    def visitLeafLogicExpression(self, ctx: MysqlQueryParser.LeafLogicExpressionContext):
        if not (isinstance(ctx.getChild(0), MysqlQueryParser.ComparisonLeafLogicExpressionContext) or isinstance(
                ctx.getChild(0), MysqlQueryParser.SetLeafLogicExpressionContext) or isinstance(
                    ctx.getChild(0), MysqlQueryParser.JudgeLeafLogicExpressionContext) or isinstance(
                        ctx.getChild(0), MysqlQueryParser.MatchLeafLogicExpressionContext)):
            nested = str(ctx.getChild(0))
            expression = self.visit(ctx.getChild(1))
        else:
            nested = "EXIST"
            expression = self.visit(ctx.getChild(0))
        #print(nested)
        expression.nested = nested
        return expression

    def visitComparisonLeafLogicExpression(self, ctx):
        field = self.visitFullColumnName(ctx.getChild(0))
        op = self.visitComparisonOperator(ctx.getChild(1))
        val = self.visitValue(ctx.getChild(2))
        expression = ComparisonExpression(field=field, op=op, val=val)
        return expression

    def visitSetLeafLogicExpression(self, ctx):
        field = self.visitFullColumnName(ctx.getChild(0))
        op = self.visitComparisonOperator(ctx.getChild(1))
        val = "("
        num = 0
        for element in ctx.children:
            if isinstance(element, MysqlQueryParser.ValueContext):
                num += 1
                if num == 1:
                    val += self.visitValue(element)
                else:
                    val += ","+self.visitValue(element)
        val += ")"
        expression = ComparisonExpression(field=field, op=op, val=val)
        return expression

    def visitInt(self, ctx):
        return int(ctx.getText())
