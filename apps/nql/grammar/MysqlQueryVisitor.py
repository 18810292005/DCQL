# Generated from MysqlQuery.g4 by ANTLR 4.7.2
from antlr4 import *
if __name__ is not None and "." in __name__:
    from .MysqlQueryParser import MysqlQueryParser
else:
    from MysqlQueryParser import MysqlQueryParser

# This class defines a complete generic visitor for a parse tree produced by MysqlQueryParser.

class MysqlQueryVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by MysqlQueryParser#templateName.
    def visitTemplateName(self, ctx:MysqlQueryParser.TemplateNameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#column_name.
    def visitColumn_name(self, ctx:MysqlQueryParser.Column_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#function_name.
    def visitFunction_name(self, ctx:MysqlQueryParser.Function_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#unit_name.
    def visitUnit_name(self, ctx:MysqlQueryParser.Unit_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#unit.
    def visitUnit(self, ctx:MysqlQueryParser.UnitContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#option_name.
    def visitOption_name(self, ctx:MysqlQueryParser.Option_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#option_group_name.
    def visitOption_group_name(self, ctx:MysqlQueryParser.Option_group_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_string_type.
    def visitCreate_string_type(self, ctx:MysqlQueryParser.Create_string_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_number_type.
    def visitCreate_number_type(self, ctx:MysqlQueryParser.Create_number_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_range_type.
    def visitCreate_range_type(self, ctx:MysqlQueryParser.Create_range_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#choice_type.
    def visitChoice_type(self, ctx:MysqlQueryParser.Choice_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#choice_type_remove.
    def visitChoice_type_remove(self, ctx:MysqlQueryParser.Choice_type_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#choice_group_type.
    def visitChoice_group_type(self, ctx:MysqlQueryParser.Choice_group_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_choice_type.
    def visitCreate_choice_type(self, ctx:MysqlQueryParser.Create_choice_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_image_type.
    def visitCreate_image_type(self, ctx:MysqlQueryParser.Create_image_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_file_type.
    def visitCreate_file_type(self, ctx:MysqlQueryParser.Create_file_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_table_type.
    def visitCreate_table_type(self, ctx:MysqlQueryParser.Create_table_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_type.
    def visitArray_type(self, ctx:MysqlQueryParser.Array_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_array_type.
    def visitCreate_array_type(self, ctx:MysqlQueryParser.Create_array_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_container_type.
    def visitCreate_container_type(self, ctx:MysqlQueryParser.Create_container_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#generator_type.
    def visitGenerator_type(self, ctx:MysqlQueryParser.Generator_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_generator_type.
    def visitCreate_generator_type(self, ctx:MysqlQueryParser.Create_generator_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_string_value_remove.
    def visitInsert_string_value_remove(self, ctx:MysqlQueryParser.Insert_string_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_number_value_remove.
    def visitInsert_number_value_remove(self, ctx:MysqlQueryParser.Insert_number_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_range_value_remove.
    def visitInsert_range_value_remove(self, ctx:MysqlQueryParser.Insert_range_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_choice_value_remove.
    def visitInsert_choice_value_remove(self, ctx:MysqlQueryParser.Insert_choice_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_image_value_remove.
    def visitInsert_image_value_remove(self, ctx:MysqlQueryParser.Insert_image_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_file_value_remove.
    def visitInsert_file_value_remove(self, ctx:MysqlQueryParser.Insert_file_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_table_value_remove.
    def visitInsert_table_value_remove(self, ctx:MysqlQueryParser.Insert_table_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_container_value_remove.
    def visitInsert_container_value_remove(self, ctx:MysqlQueryParser.Insert_container_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_generator_value_remove.
    def visitInsert_generator_value_remove(self, ctx:MysqlQueryParser.Insert_generator_value_removeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_string_value.
    def visitInsert_string_value(self, ctx:MysqlQueryParser.Insert_string_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_number_value.
    def visitInsert_number_value(self, ctx:MysqlQueryParser.Insert_number_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_range_value.
    def visitInsert_range_value(self, ctx:MysqlQueryParser.Insert_range_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_choice_value.
    def visitInsert_choice_value(self, ctx:MysqlQueryParser.Insert_choice_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_image_value.
    def visitInsert_image_value(self, ctx:MysqlQueryParser.Insert_image_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_file_value.
    def visitInsert_file_value(self, ctx:MysqlQueryParser.Insert_file_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#table_row.
    def visitTable_row(self, ctx:MysqlQueryParser.Table_rowContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_table_value.
    def visitInsert_table_value(self, ctx:MysqlQueryParser.Insert_table_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_string.
    def visitArray_element_string(self, ctx:MysqlQueryParser.Array_element_stringContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_number.
    def visitArray_element_number(self, ctx:MysqlQueryParser.Array_element_numberContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_range.
    def visitArray_element_range(self, ctx:MysqlQueryParser.Array_element_rangeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_choice.
    def visitArray_element_choice(self, ctx:MysqlQueryParser.Array_element_choiceContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_image.
    def visitArray_element_image(self, ctx:MysqlQueryParser.Array_element_imageContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_file.
    def visitArray_element_file(self, ctx:MysqlQueryParser.Array_element_fileContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_table.
    def visitArray_element_table(self, ctx:MysqlQueryParser.Array_element_tableContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_container.
    def visitArray_element_container(self, ctx:MysqlQueryParser.Array_element_containerContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#array_element_generator.
    def visitArray_element_generator(self, ctx:MysqlQueryParser.Array_element_generatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_array_value.
    def visitInsert_array_value(self, ctx:MysqlQueryParser.Insert_array_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#container_element.
    def visitContainer_element(self, ctx:MysqlQueryParser.Container_elementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_container_value.
    def visitInsert_container_value(self, ctx:MysqlQueryParser.Insert_container_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#generator_element.
    def visitGenerator_element(self, ctx:MysqlQueryParser.Generator_elementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_generator_value.
    def visitInsert_generator_value(self, ctx:MysqlQueryParser.Insert_generator_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#simpleStatement.
    def visitSimpleStatement(self, ctx:MysqlQueryParser.SimpleStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#controlStatement.
    def visitControlStatement(self, ctx:MysqlQueryParser.ControlStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#role_name.
    def visitRole_name(self, ctx:MysqlQueryParser.Role_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#user_name.
    def visitUser_name(self, ctx:MysqlQueryParser.User_nameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#password.
    def visitPassword(self, ctx:MysqlQueryParser.PasswordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#action.
    def visitAction(self, ctx:MysqlQueryParser.ActionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#resource.
    def visitResource(self, ctx:MysqlQueryParser.ResourceContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#privilege.
    def visitPrivilege(self, ctx:MysqlQueryParser.PrivilegeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_role.
    def visitCreate_role(self, ctx:MysqlQueryParser.Create_roleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#drop_role.
    def visitDrop_role(self, ctx:MysqlQueryParser.Drop_roleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#rename_role.
    def visitRename_role(self, ctx:MysqlQueryParser.Rename_roleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#grant_privilege_to_role.
    def visitGrant_privilege_to_role(self, ctx:MysqlQueryParser.Grant_privilege_to_roleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#revoke_privilege_from_role.
    def visitRevoke_privilege_from_role(self, ctx:MysqlQueryParser.Revoke_privilege_from_roleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#show_role.
    def visitShow_role(self, ctx:MysqlQueryParser.Show_roleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_user.
    def visitCreate_user(self, ctx:MysqlQueryParser.Create_userContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#drop_user.
    def visitDrop_user(self, ctx:MysqlQueryParser.Drop_userContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#rename_user.
    def visitRename_user(self, ctx:MysqlQueryParser.Rename_userContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#update_user_password.
    def visitUpdate_user_password(self, ctx:MysqlQueryParser.Update_user_passwordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#grant_role_to_user.
    def visitGrant_role_to_user(self, ctx:MysqlQueryParser.Grant_role_to_userContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#revoke_role_from_user.
    def visitRevoke_role_from_user(self, ctx:MysqlQueryParser.Revoke_role_from_userContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#show_user.
    def visitShow_user(self, ctx:MysqlQueryParser.Show_userContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#alterStatement.
    def visitAlterStatement(self, ctx:MysqlQueryParser.AlterStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#alterStatements.
    def visitAlterStatements(self, ctx:MysqlQueryParser.AlterStatementsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#add_content.
    def visitAdd_content(self, ctx:MysqlQueryParser.Add_contentContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#add_contents.
    def visitAdd_contents(self, ctx:MysqlQueryParser.Add_contentsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#drop_content.
    def visitDrop_content(self, ctx:MysqlQueryParser.Drop_contentContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#drop_contents.
    def visitDrop_contents(self, ctx:MysqlQueryParser.Drop_contentsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#alter_content.
    def visitAlter_content(self, ctx:MysqlQueryParser.Alter_contentContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#alter_contents.
    def visitAlter_contents(self, ctx:MysqlQueryParser.Alter_contentsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#updateStatement.
    def visitUpdateStatement(self, ctx:MysqlQueryParser.UpdateStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#deleteStatement.
    def visitDeleteStatement(self, ctx:MysqlQueryParser.DeleteStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#dropStatement.
    def visitDropStatement(self, ctx:MysqlQueryParser.DropStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insertStatement.
    def visitInsertStatement(self, ctx:MysqlQueryParser.InsertStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_all_values.
    def visitInsert_all_values(self, ctx:MysqlQueryParser.Insert_all_valuesContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_all_value.
    def visitInsert_all_value(self, ctx:MysqlQueryParser.Insert_all_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_unnested_value.
    def visitInsert_unnested_value(self, ctx:MysqlQueryParser.Insert_unnested_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#insert_nested_value.
    def visitInsert_nested_value(self, ctx:MysqlQueryParser.Insert_nested_valueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#createStatement.
    def visitCreateStatement(self, ctx:MysqlQueryParser.CreateStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_all_type.
    def visitCreate_all_type(self, ctx:MysqlQueryParser.Create_all_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_unnested_type.
    def visitCreate_unnested_type(self, ctx:MysqlQueryParser.Create_unnested_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#create_nested_type.
    def visitCreate_nested_type(self, ctx:MysqlQueryParser.Create_nested_typeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#selectStatement.
    def visitSelectStatement(self, ctx:MysqlQueryParser.SelectStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#describeStatement.
    def visitDescribeStatement(self, ctx:MysqlQueryParser.DescribeStatementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#selectElements.
    def visitSelectElements(self, ctx:MysqlQueryParser.SelectElementsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#tableSources.
    def visitTableSources(self, ctx:MysqlQueryParser.TableSourcesContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#whereClause.
    def visitWhereClause(self, ctx:MysqlQueryParser.WhereClauseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#logicExpression.
    def visitLogicExpression(self, ctx:MysqlQueryParser.LogicExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#leafLogicExpression.
    def visitLeafLogicExpression(self, ctx:MysqlQueryParser.LeafLogicExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#comparisonLeafLogicExpression.
    def visitComparisonLeafLogicExpression(self, ctx:MysqlQueryParser.ComparisonLeafLogicExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#setLeafLogicExpression.
    def visitSetLeafLogicExpression(self, ctx:MysqlQueryParser.SetLeafLogicExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#judgeLeafLogicExpression.
    def visitJudgeLeafLogicExpression(self, ctx:MysqlQueryParser.JudgeLeafLogicExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#matchLeafLogicExpression.
    def visitMatchLeafLogicExpression(self, ctx:MysqlQueryParser.MatchLeafLogicExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#groupByCaluse.
    def visitGroupByCaluse(self, ctx:MysqlQueryParser.GroupByCaluseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#havingCaluse.
    def visitHavingCaluse(self, ctx:MysqlQueryParser.HavingCaluseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#orderByClause.
    def visitOrderByClause(self, ctx:MysqlQueryParser.OrderByClauseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#limitClause.
    def visitLimitClause(self, ctx:MysqlQueryParser.LimitClauseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#orderByExpression.
    def visitOrderByExpression(self, ctx:MysqlQueryParser.OrderByExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#groupByItem.
    def visitGroupByItem(self, ctx:MysqlQueryParser.GroupByItemContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#logicalOperator.
    def visitLogicalOperator(self, ctx:MysqlQueryParser.LogicalOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#comparisonOperator.
    def visitComparisonOperator(self, ctx:MysqlQueryParser.ComparisonOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#value.
    def visitValue(self, ctx:MysqlQueryParser.ValueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#decimalLiteral.
    def visitDecimalLiteral(self, ctx:MysqlQueryParser.DecimalLiteralContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#textLiteral.
    def visitTextLiteral(self, ctx:MysqlQueryParser.TextLiteralContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#selectColumnElement.
    def visitSelectColumnElement(self, ctx:MysqlQueryParser.SelectColumnElementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#selectFunctionElement.
    def visitSelectFunctionElement(self, ctx:MysqlQueryParser.SelectFunctionElementContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#fullColumnName.
    def visitFullColumnName(self, ctx:MysqlQueryParser.FullColumnNameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#aggregateFunctionCall.
    def visitAggregateFunctionCall(self, ctx:MysqlQueryParser.AggregateFunctionCallContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#aggregateWindowedFunction.
    def visitAggregateWindowedFunction(self, ctx:MysqlQueryParser.AggregateWindowedFunctionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#functionArg.
    def visitFunctionArg(self, ctx:MysqlQueryParser.FunctionArgContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#functionArgs.
    def visitFunctionArgs(self, ctx:MysqlQueryParser.FunctionArgsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#uid.
    def visitUid(self, ctx:MysqlQueryParser.UidContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#stringText.
    def visitStringText(self, ctx:MysqlQueryParser.StringTextContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by MysqlQueryParser#pathText.
    def visitPathText(self, ctx:MysqlQueryParser.PathTextContext):
        return self.visitChildren(ctx)



del MysqlQueryParser