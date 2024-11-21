# Generated from MysqlQuery.g4 by ANTLR 4.7.2
from antlr4 import *
if __name__ is not None and "." in __name__:
    from .MysqlQueryParser import MysqlQueryParser
else:
    from MysqlQueryParser import MysqlQueryParser

# This class defines a complete listener for a parse tree produced by MysqlQueryParser.
class MysqlQueryListener(ParseTreeListener):

    # Enter a parse tree produced by MysqlQueryParser#templateName.
    def enterTemplateName(self, ctx:MysqlQueryParser.TemplateNameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#templateName.
    def exitTemplateName(self, ctx:MysqlQueryParser.TemplateNameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#column_name.
    def enterColumn_name(self, ctx:MysqlQueryParser.Column_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#column_name.
    def exitColumn_name(self, ctx:MysqlQueryParser.Column_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#function_name.
    def enterFunction_name(self, ctx:MysqlQueryParser.Function_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#function_name.
    def exitFunction_name(self, ctx:MysqlQueryParser.Function_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#unit_name.
    def enterUnit_name(self, ctx:MysqlQueryParser.Unit_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#unit_name.
    def exitUnit_name(self, ctx:MysqlQueryParser.Unit_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#unit.
    def enterUnit(self, ctx:MysqlQueryParser.UnitContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#unit.
    def exitUnit(self, ctx:MysqlQueryParser.UnitContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#option_name.
    def enterOption_name(self, ctx:MysqlQueryParser.Option_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#option_name.
    def exitOption_name(self, ctx:MysqlQueryParser.Option_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#option_group_name.
    def enterOption_group_name(self, ctx:MysqlQueryParser.Option_group_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#option_group_name.
    def exitOption_group_name(self, ctx:MysqlQueryParser.Option_group_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_string_type.
    def enterCreate_string_type(self, ctx:MysqlQueryParser.Create_string_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_string_type.
    def exitCreate_string_type(self, ctx:MysqlQueryParser.Create_string_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_number_type.
    def enterCreate_number_type(self, ctx:MysqlQueryParser.Create_number_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_number_type.
    def exitCreate_number_type(self, ctx:MysqlQueryParser.Create_number_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_range_type.
    def enterCreate_range_type(self, ctx:MysqlQueryParser.Create_range_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_range_type.
    def exitCreate_range_type(self, ctx:MysqlQueryParser.Create_range_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#choice_type.
    def enterChoice_type(self, ctx:MysqlQueryParser.Choice_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#choice_type.
    def exitChoice_type(self, ctx:MysqlQueryParser.Choice_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#choice_type_remove.
    def enterChoice_type_remove(self, ctx:MysqlQueryParser.Choice_type_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#choice_type_remove.
    def exitChoice_type_remove(self, ctx:MysqlQueryParser.Choice_type_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#choice_group_type.
    def enterChoice_group_type(self, ctx:MysqlQueryParser.Choice_group_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#choice_group_type.
    def exitChoice_group_type(self, ctx:MysqlQueryParser.Choice_group_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_choice_type.
    def enterCreate_choice_type(self, ctx:MysqlQueryParser.Create_choice_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_choice_type.
    def exitCreate_choice_type(self, ctx:MysqlQueryParser.Create_choice_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_image_type.
    def enterCreate_image_type(self, ctx:MysqlQueryParser.Create_image_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_image_type.
    def exitCreate_image_type(self, ctx:MysqlQueryParser.Create_image_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_file_type.
    def enterCreate_file_type(self, ctx:MysqlQueryParser.Create_file_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_file_type.
    def exitCreate_file_type(self, ctx:MysqlQueryParser.Create_file_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_table_type.
    def enterCreate_table_type(self, ctx:MysqlQueryParser.Create_table_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_table_type.
    def exitCreate_table_type(self, ctx:MysqlQueryParser.Create_table_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_type.
    def enterArray_type(self, ctx:MysqlQueryParser.Array_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_type.
    def exitArray_type(self, ctx:MysqlQueryParser.Array_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_array_type.
    def enterCreate_array_type(self, ctx:MysqlQueryParser.Create_array_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_array_type.
    def exitCreate_array_type(self, ctx:MysqlQueryParser.Create_array_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_container_type.
    def enterCreate_container_type(self, ctx:MysqlQueryParser.Create_container_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_container_type.
    def exitCreate_container_type(self, ctx:MysqlQueryParser.Create_container_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#generator_type.
    def enterGenerator_type(self, ctx:MysqlQueryParser.Generator_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#generator_type.
    def exitGenerator_type(self, ctx:MysqlQueryParser.Generator_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_generator_type.
    def enterCreate_generator_type(self, ctx:MysqlQueryParser.Create_generator_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_generator_type.
    def exitCreate_generator_type(self, ctx:MysqlQueryParser.Create_generator_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_string_value_remove.
    def enterInsert_string_value_remove(self, ctx:MysqlQueryParser.Insert_string_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_string_value_remove.
    def exitInsert_string_value_remove(self, ctx:MysqlQueryParser.Insert_string_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_number_value_remove.
    def enterInsert_number_value_remove(self, ctx:MysqlQueryParser.Insert_number_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_number_value_remove.
    def exitInsert_number_value_remove(self, ctx:MysqlQueryParser.Insert_number_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_range_value_remove.
    def enterInsert_range_value_remove(self, ctx:MysqlQueryParser.Insert_range_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_range_value_remove.
    def exitInsert_range_value_remove(self, ctx:MysqlQueryParser.Insert_range_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_choice_value_remove.
    def enterInsert_choice_value_remove(self, ctx:MysqlQueryParser.Insert_choice_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_choice_value_remove.
    def exitInsert_choice_value_remove(self, ctx:MysqlQueryParser.Insert_choice_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_image_value_remove.
    def enterInsert_image_value_remove(self, ctx:MysqlQueryParser.Insert_image_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_image_value_remove.
    def exitInsert_image_value_remove(self, ctx:MysqlQueryParser.Insert_image_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_file_value_remove.
    def enterInsert_file_value_remove(self, ctx:MysqlQueryParser.Insert_file_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_file_value_remove.
    def exitInsert_file_value_remove(self, ctx:MysqlQueryParser.Insert_file_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_table_value_remove.
    def enterInsert_table_value_remove(self, ctx:MysqlQueryParser.Insert_table_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_table_value_remove.
    def exitInsert_table_value_remove(self, ctx:MysqlQueryParser.Insert_table_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_container_value_remove.
    def enterInsert_container_value_remove(self, ctx:MysqlQueryParser.Insert_container_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_container_value_remove.
    def exitInsert_container_value_remove(self, ctx:MysqlQueryParser.Insert_container_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_generator_value_remove.
    def enterInsert_generator_value_remove(self, ctx:MysqlQueryParser.Insert_generator_value_removeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_generator_value_remove.
    def exitInsert_generator_value_remove(self, ctx:MysqlQueryParser.Insert_generator_value_removeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_string_value.
    def enterInsert_string_value(self, ctx:MysqlQueryParser.Insert_string_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_string_value.
    def exitInsert_string_value(self, ctx:MysqlQueryParser.Insert_string_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_number_value.
    def enterInsert_number_value(self, ctx:MysqlQueryParser.Insert_number_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_number_value.
    def exitInsert_number_value(self, ctx:MysqlQueryParser.Insert_number_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_range_value.
    def enterInsert_range_value(self, ctx:MysqlQueryParser.Insert_range_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_range_value.
    def exitInsert_range_value(self, ctx:MysqlQueryParser.Insert_range_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_choice_value.
    def enterInsert_choice_value(self, ctx:MysqlQueryParser.Insert_choice_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_choice_value.
    def exitInsert_choice_value(self, ctx:MysqlQueryParser.Insert_choice_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_image_value.
    def enterInsert_image_value(self, ctx:MysqlQueryParser.Insert_image_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_image_value.
    def exitInsert_image_value(self, ctx:MysqlQueryParser.Insert_image_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_file_value.
    def enterInsert_file_value(self, ctx:MysqlQueryParser.Insert_file_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_file_value.
    def exitInsert_file_value(self, ctx:MysqlQueryParser.Insert_file_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#table_row.
    def enterTable_row(self, ctx:MysqlQueryParser.Table_rowContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#table_row.
    def exitTable_row(self, ctx:MysqlQueryParser.Table_rowContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_table_value.
    def enterInsert_table_value(self, ctx:MysqlQueryParser.Insert_table_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_table_value.
    def exitInsert_table_value(self, ctx:MysqlQueryParser.Insert_table_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_string.
    def enterArray_element_string(self, ctx:MysqlQueryParser.Array_element_stringContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_string.
    def exitArray_element_string(self, ctx:MysqlQueryParser.Array_element_stringContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_number.
    def enterArray_element_number(self, ctx:MysqlQueryParser.Array_element_numberContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_number.
    def exitArray_element_number(self, ctx:MysqlQueryParser.Array_element_numberContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_range.
    def enterArray_element_range(self, ctx:MysqlQueryParser.Array_element_rangeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_range.
    def exitArray_element_range(self, ctx:MysqlQueryParser.Array_element_rangeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_choice.
    def enterArray_element_choice(self, ctx:MysqlQueryParser.Array_element_choiceContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_choice.
    def exitArray_element_choice(self, ctx:MysqlQueryParser.Array_element_choiceContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_image.
    def enterArray_element_image(self, ctx:MysqlQueryParser.Array_element_imageContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_image.
    def exitArray_element_image(self, ctx:MysqlQueryParser.Array_element_imageContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_file.
    def enterArray_element_file(self, ctx:MysqlQueryParser.Array_element_fileContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_file.
    def exitArray_element_file(self, ctx:MysqlQueryParser.Array_element_fileContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_table.
    def enterArray_element_table(self, ctx:MysqlQueryParser.Array_element_tableContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_table.
    def exitArray_element_table(self, ctx:MysqlQueryParser.Array_element_tableContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_container.
    def enterArray_element_container(self, ctx:MysqlQueryParser.Array_element_containerContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_container.
    def exitArray_element_container(self, ctx:MysqlQueryParser.Array_element_containerContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#array_element_generator.
    def enterArray_element_generator(self, ctx:MysqlQueryParser.Array_element_generatorContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#array_element_generator.
    def exitArray_element_generator(self, ctx:MysqlQueryParser.Array_element_generatorContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_array_value.
    def enterInsert_array_value(self, ctx:MysqlQueryParser.Insert_array_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_array_value.
    def exitInsert_array_value(self, ctx:MysqlQueryParser.Insert_array_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#container_element.
    def enterContainer_element(self, ctx:MysqlQueryParser.Container_elementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#container_element.
    def exitContainer_element(self, ctx:MysqlQueryParser.Container_elementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_container_value.
    def enterInsert_container_value(self, ctx:MysqlQueryParser.Insert_container_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_container_value.
    def exitInsert_container_value(self, ctx:MysqlQueryParser.Insert_container_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#generator_element.
    def enterGenerator_element(self, ctx:MysqlQueryParser.Generator_elementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#generator_element.
    def exitGenerator_element(self, ctx:MysqlQueryParser.Generator_elementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_generator_value.
    def enterInsert_generator_value(self, ctx:MysqlQueryParser.Insert_generator_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_generator_value.
    def exitInsert_generator_value(self, ctx:MysqlQueryParser.Insert_generator_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#simpleStatement.
    def enterSimpleStatement(self, ctx:MysqlQueryParser.SimpleStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#simpleStatement.
    def exitSimpleStatement(self, ctx:MysqlQueryParser.SimpleStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#controlStatement.
    def enterControlStatement(self, ctx:MysqlQueryParser.ControlStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#controlStatement.
    def exitControlStatement(self, ctx:MysqlQueryParser.ControlStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#role_name.
    def enterRole_name(self, ctx:MysqlQueryParser.Role_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#role_name.
    def exitRole_name(self, ctx:MysqlQueryParser.Role_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#user_name.
    def enterUser_name(self, ctx:MysqlQueryParser.User_nameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#user_name.
    def exitUser_name(self, ctx:MysqlQueryParser.User_nameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#password.
    def enterPassword(self, ctx:MysqlQueryParser.PasswordContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#password.
    def exitPassword(self, ctx:MysqlQueryParser.PasswordContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#action.
    def enterAction(self, ctx:MysqlQueryParser.ActionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#action.
    def exitAction(self, ctx:MysqlQueryParser.ActionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#resource.
    def enterResource(self, ctx:MysqlQueryParser.ResourceContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#resource.
    def exitResource(self, ctx:MysqlQueryParser.ResourceContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#privilege.
    def enterPrivilege(self, ctx:MysqlQueryParser.PrivilegeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#privilege.
    def exitPrivilege(self, ctx:MysqlQueryParser.PrivilegeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_role.
    def enterCreate_role(self, ctx:MysqlQueryParser.Create_roleContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_role.
    def exitCreate_role(self, ctx:MysqlQueryParser.Create_roleContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#drop_role.
    def enterDrop_role(self, ctx:MysqlQueryParser.Drop_roleContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#drop_role.
    def exitDrop_role(self, ctx:MysqlQueryParser.Drop_roleContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#rename_role.
    def enterRename_role(self, ctx:MysqlQueryParser.Rename_roleContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#rename_role.
    def exitRename_role(self, ctx:MysqlQueryParser.Rename_roleContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#grant_privilege_to_role.
    def enterGrant_privilege_to_role(self, ctx:MysqlQueryParser.Grant_privilege_to_roleContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#grant_privilege_to_role.
    def exitGrant_privilege_to_role(self, ctx:MysqlQueryParser.Grant_privilege_to_roleContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#revoke_privilege_from_role.
    def enterRevoke_privilege_from_role(self, ctx:MysqlQueryParser.Revoke_privilege_from_roleContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#revoke_privilege_from_role.
    def exitRevoke_privilege_from_role(self, ctx:MysqlQueryParser.Revoke_privilege_from_roleContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#show_role.
    def enterShow_role(self, ctx:MysqlQueryParser.Show_roleContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#show_role.
    def exitShow_role(self, ctx:MysqlQueryParser.Show_roleContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_user.
    def enterCreate_user(self, ctx:MysqlQueryParser.Create_userContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_user.
    def exitCreate_user(self, ctx:MysqlQueryParser.Create_userContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#drop_user.
    def enterDrop_user(self, ctx:MysqlQueryParser.Drop_userContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#drop_user.
    def exitDrop_user(self, ctx:MysqlQueryParser.Drop_userContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#rename_user.
    def enterRename_user(self, ctx:MysqlQueryParser.Rename_userContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#rename_user.
    def exitRename_user(self, ctx:MysqlQueryParser.Rename_userContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#update_user_password.
    def enterUpdate_user_password(self, ctx:MysqlQueryParser.Update_user_passwordContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#update_user_password.
    def exitUpdate_user_password(self, ctx:MysqlQueryParser.Update_user_passwordContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#grant_role_to_user.
    def enterGrant_role_to_user(self, ctx:MysqlQueryParser.Grant_role_to_userContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#grant_role_to_user.
    def exitGrant_role_to_user(self, ctx:MysqlQueryParser.Grant_role_to_userContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#revoke_role_from_user.
    def enterRevoke_role_from_user(self, ctx:MysqlQueryParser.Revoke_role_from_userContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#revoke_role_from_user.
    def exitRevoke_role_from_user(self, ctx:MysqlQueryParser.Revoke_role_from_userContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#show_user.
    def enterShow_user(self, ctx:MysqlQueryParser.Show_userContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#show_user.
    def exitShow_user(self, ctx:MysqlQueryParser.Show_userContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#alterStatement.
    def enterAlterStatement(self, ctx:MysqlQueryParser.AlterStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#alterStatement.
    def exitAlterStatement(self, ctx:MysqlQueryParser.AlterStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#alterStatements.
    def enterAlterStatements(self, ctx:MysqlQueryParser.AlterStatementsContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#alterStatements.
    def exitAlterStatements(self, ctx:MysqlQueryParser.AlterStatementsContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#add_content.
    def enterAdd_content(self, ctx:MysqlQueryParser.Add_contentContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#add_content.
    def exitAdd_content(self, ctx:MysqlQueryParser.Add_contentContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#add_contents.
    def enterAdd_contents(self, ctx:MysqlQueryParser.Add_contentsContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#add_contents.
    def exitAdd_contents(self, ctx:MysqlQueryParser.Add_contentsContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#drop_content.
    def enterDrop_content(self, ctx:MysqlQueryParser.Drop_contentContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#drop_content.
    def exitDrop_content(self, ctx:MysqlQueryParser.Drop_contentContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#drop_contents.
    def enterDrop_contents(self, ctx:MysqlQueryParser.Drop_contentsContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#drop_contents.
    def exitDrop_contents(self, ctx:MysqlQueryParser.Drop_contentsContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#alter_content.
    def enterAlter_content(self, ctx:MysqlQueryParser.Alter_contentContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#alter_content.
    def exitAlter_content(self, ctx:MysqlQueryParser.Alter_contentContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#alter_contents.
    def enterAlter_contents(self, ctx:MysqlQueryParser.Alter_contentsContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#alter_contents.
    def exitAlter_contents(self, ctx:MysqlQueryParser.Alter_contentsContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#updateStatement.
    def enterUpdateStatement(self, ctx:MysqlQueryParser.UpdateStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#updateStatement.
    def exitUpdateStatement(self, ctx:MysqlQueryParser.UpdateStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#deleteStatement.
    def enterDeleteStatement(self, ctx:MysqlQueryParser.DeleteStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#deleteStatement.
    def exitDeleteStatement(self, ctx:MysqlQueryParser.DeleteStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#dropStatement.
    def enterDropStatement(self, ctx:MysqlQueryParser.DropStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#dropStatement.
    def exitDropStatement(self, ctx:MysqlQueryParser.DropStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insertStatement.
    def enterInsertStatement(self, ctx:MysqlQueryParser.InsertStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insertStatement.
    def exitInsertStatement(self, ctx:MysqlQueryParser.InsertStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_all_values.
    def enterInsert_all_values(self, ctx:MysqlQueryParser.Insert_all_valuesContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_all_values.
    def exitInsert_all_values(self, ctx:MysqlQueryParser.Insert_all_valuesContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_all_value.
    def enterInsert_all_value(self, ctx:MysqlQueryParser.Insert_all_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_all_value.
    def exitInsert_all_value(self, ctx:MysqlQueryParser.Insert_all_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_unnested_value.
    def enterInsert_unnested_value(self, ctx:MysqlQueryParser.Insert_unnested_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_unnested_value.
    def exitInsert_unnested_value(self, ctx:MysqlQueryParser.Insert_unnested_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#insert_nested_value.
    def enterInsert_nested_value(self, ctx:MysqlQueryParser.Insert_nested_valueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#insert_nested_value.
    def exitInsert_nested_value(self, ctx:MysqlQueryParser.Insert_nested_valueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#createStatement.
    def enterCreateStatement(self, ctx:MysqlQueryParser.CreateStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#createStatement.
    def exitCreateStatement(self, ctx:MysqlQueryParser.CreateStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_all_type.
    def enterCreate_all_type(self, ctx:MysqlQueryParser.Create_all_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_all_type.
    def exitCreate_all_type(self, ctx:MysqlQueryParser.Create_all_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_unnested_type.
    def enterCreate_unnested_type(self, ctx:MysqlQueryParser.Create_unnested_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_unnested_type.
    def exitCreate_unnested_type(self, ctx:MysqlQueryParser.Create_unnested_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#create_nested_type.
    def enterCreate_nested_type(self, ctx:MysqlQueryParser.Create_nested_typeContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#create_nested_type.
    def exitCreate_nested_type(self, ctx:MysqlQueryParser.Create_nested_typeContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#selectStatement.
    def enterSelectStatement(self, ctx:MysqlQueryParser.SelectStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#selectStatement.
    def exitSelectStatement(self, ctx:MysqlQueryParser.SelectStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#describeStatement.
    def enterDescribeStatement(self, ctx:MysqlQueryParser.DescribeStatementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#describeStatement.
    def exitDescribeStatement(self, ctx:MysqlQueryParser.DescribeStatementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#selectElements.
    def enterSelectElements(self, ctx:MysqlQueryParser.SelectElementsContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#selectElements.
    def exitSelectElements(self, ctx:MysqlQueryParser.SelectElementsContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#tableSources.
    def enterTableSources(self, ctx:MysqlQueryParser.TableSourcesContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#tableSources.
    def exitTableSources(self, ctx:MysqlQueryParser.TableSourcesContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#whereClause.
    def enterWhereClause(self, ctx:MysqlQueryParser.WhereClauseContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#whereClause.
    def exitWhereClause(self, ctx:MysqlQueryParser.WhereClauseContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#logicExpression.
    def enterLogicExpression(self, ctx:MysqlQueryParser.LogicExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#logicExpression.
    def exitLogicExpression(self, ctx:MysqlQueryParser.LogicExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#leafLogicExpression.
    def enterLeafLogicExpression(self, ctx:MysqlQueryParser.LeafLogicExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#leafLogicExpression.
    def exitLeafLogicExpression(self, ctx:MysqlQueryParser.LeafLogicExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#comparisonLeafLogicExpression.
    def enterComparisonLeafLogicExpression(self, ctx:MysqlQueryParser.ComparisonLeafLogicExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#comparisonLeafLogicExpression.
    def exitComparisonLeafLogicExpression(self, ctx:MysqlQueryParser.ComparisonLeafLogicExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#setLeafLogicExpression.
    def enterSetLeafLogicExpression(self, ctx:MysqlQueryParser.SetLeafLogicExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#setLeafLogicExpression.
    def exitSetLeafLogicExpression(self, ctx:MysqlQueryParser.SetLeafLogicExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#judgeLeafLogicExpression.
    def enterJudgeLeafLogicExpression(self, ctx:MysqlQueryParser.JudgeLeafLogicExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#judgeLeafLogicExpression.
    def exitJudgeLeafLogicExpression(self, ctx:MysqlQueryParser.JudgeLeafLogicExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#matchLeafLogicExpression.
    def enterMatchLeafLogicExpression(self, ctx:MysqlQueryParser.MatchLeafLogicExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#matchLeafLogicExpression.
    def exitMatchLeafLogicExpression(self, ctx:MysqlQueryParser.MatchLeafLogicExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#groupByCaluse.
    def enterGroupByCaluse(self, ctx:MysqlQueryParser.GroupByCaluseContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#groupByCaluse.
    def exitGroupByCaluse(self, ctx:MysqlQueryParser.GroupByCaluseContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#havingCaluse.
    def enterHavingCaluse(self, ctx:MysqlQueryParser.HavingCaluseContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#havingCaluse.
    def exitHavingCaluse(self, ctx:MysqlQueryParser.HavingCaluseContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#orderByClause.
    def enterOrderByClause(self, ctx:MysqlQueryParser.OrderByClauseContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#orderByClause.
    def exitOrderByClause(self, ctx:MysqlQueryParser.OrderByClauseContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#limitClause.
    def enterLimitClause(self, ctx:MysqlQueryParser.LimitClauseContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#limitClause.
    def exitLimitClause(self, ctx:MysqlQueryParser.LimitClauseContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#orderByExpression.
    def enterOrderByExpression(self, ctx:MysqlQueryParser.OrderByExpressionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#orderByExpression.
    def exitOrderByExpression(self, ctx:MysqlQueryParser.OrderByExpressionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#groupByItem.
    def enterGroupByItem(self, ctx:MysqlQueryParser.GroupByItemContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#groupByItem.
    def exitGroupByItem(self, ctx:MysqlQueryParser.GroupByItemContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#logicalOperator.
    def enterLogicalOperator(self, ctx:MysqlQueryParser.LogicalOperatorContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#logicalOperator.
    def exitLogicalOperator(self, ctx:MysqlQueryParser.LogicalOperatorContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#comparisonOperator.
    def enterComparisonOperator(self, ctx:MysqlQueryParser.ComparisonOperatorContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#comparisonOperator.
    def exitComparisonOperator(self, ctx:MysqlQueryParser.ComparisonOperatorContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#value.
    def enterValue(self, ctx:MysqlQueryParser.ValueContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#value.
    def exitValue(self, ctx:MysqlQueryParser.ValueContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#decimalLiteral.
    def enterDecimalLiteral(self, ctx:MysqlQueryParser.DecimalLiteralContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#decimalLiteral.
    def exitDecimalLiteral(self, ctx:MysqlQueryParser.DecimalLiteralContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#textLiteral.
    def enterTextLiteral(self, ctx:MysqlQueryParser.TextLiteralContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#textLiteral.
    def exitTextLiteral(self, ctx:MysqlQueryParser.TextLiteralContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#selectColumnElement.
    def enterSelectColumnElement(self, ctx:MysqlQueryParser.SelectColumnElementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#selectColumnElement.
    def exitSelectColumnElement(self, ctx:MysqlQueryParser.SelectColumnElementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#selectFunctionElement.
    def enterSelectFunctionElement(self, ctx:MysqlQueryParser.SelectFunctionElementContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#selectFunctionElement.
    def exitSelectFunctionElement(self, ctx:MysqlQueryParser.SelectFunctionElementContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#fullColumnName.
    def enterFullColumnName(self, ctx:MysqlQueryParser.FullColumnNameContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#fullColumnName.
    def exitFullColumnName(self, ctx:MysqlQueryParser.FullColumnNameContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#aggregateFunctionCall.
    def enterAggregateFunctionCall(self, ctx:MysqlQueryParser.AggregateFunctionCallContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#aggregateFunctionCall.
    def exitAggregateFunctionCall(self, ctx:MysqlQueryParser.AggregateFunctionCallContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#aggregateWindowedFunction.
    def enterAggregateWindowedFunction(self, ctx:MysqlQueryParser.AggregateWindowedFunctionContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#aggregateWindowedFunction.
    def exitAggregateWindowedFunction(self, ctx:MysqlQueryParser.AggregateWindowedFunctionContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#functionArg.
    def enterFunctionArg(self, ctx:MysqlQueryParser.FunctionArgContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#functionArg.
    def exitFunctionArg(self, ctx:MysqlQueryParser.FunctionArgContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#functionArgs.
    def enterFunctionArgs(self, ctx:MysqlQueryParser.FunctionArgsContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#functionArgs.
    def exitFunctionArgs(self, ctx:MysqlQueryParser.FunctionArgsContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#uid.
    def enterUid(self, ctx:MysqlQueryParser.UidContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#uid.
    def exitUid(self, ctx:MysqlQueryParser.UidContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#stringText.
    def enterStringText(self, ctx:MysqlQueryParser.StringTextContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#stringText.
    def exitStringText(self, ctx:MysqlQueryParser.StringTextContext):
        pass


    # Enter a parse tree produced by MysqlQueryParser#pathText.
    def enterPathText(self, ctx:MysqlQueryParser.PathTextContext):
        pass

    # Exit a parse tree produced by MysqlQueryParser#pathText.
    def exitPathText(self, ctx:MysqlQueryParser.PathTextContext):
        pass


