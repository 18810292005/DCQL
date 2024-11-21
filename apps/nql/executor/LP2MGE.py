from apps.nql.executor.QueryExecutor import FilterExecutor, ScanExecutor, SchemaExecutor
from apps.nql.logicplan.LogicalPlanNode import FilterLogicPlan, ScanLogicPlan, SchemaLogicPlan


class HandleLogicPlanTree():
    @staticmethod
    def handlePlan(plan):
        if isinstance(plan, FilterLogicPlan):
            return HandleLogicPlanTree.handleFilterLogicPlan(plan)
        elif isinstance(plan, ScanLogicPlan):
            return HandleLogicPlanTree.handleScanLogicPlan(plan)
        elif isinstance(plan, SchemaLogicPlan):
            return HandleLogicPlanTree.handleSchemaLogicPlan(plan)

    @staticmethod
    def _handle_children(plan):
        children = []
        for p in plan.children:
            e = HandleLogicPlanTree.handlePlan(p)
            children.append(e)
        return children

    @staticmethod
    def handleFilterLogicPlan(plan: FilterLogicPlan):
        return FilterExecutor(children=HandleLogicPlanTree._handle_children(plan),
                              select_elements=plan.select_elements,
                              template_name=plan.template_source[0])

    @staticmethod
    def handleScanLogicPlan(plan: ScanLogicPlan):
        if len(plan.template_source)==1:
            return ScanExecutor(children=HandleLogicPlanTree._handle_children(plan),
                            conditions=plan.where_conditions,
                            template_name=plan.template_source[0],
                            num=plan.limit)
        else:
            return ScanExecutor(children=HandleLogicPlanTree._handle_children(plan),
                            conditions=plan.where_conditions,
                            template_name=plan.template_source[0],
                            column_name=plan.template_source[1],
                            value=plan.template_source[2],
                            num=plan.limit)

    @staticmethod
    def handleSchemaLogicPlan(plan: SchemaLogicPlan):
        if len(plan.template_source)==1:
            return SchemaExecutor(template_name=plan.template_source[0],
                              create_elements=plan.create_elements,
                              type_elements=plan.type_elements,
                              insert_elements=plan.insert_elements[1:] if plan.insert_elements !=None else None,
                                  insert_source=plan.insert_elements[0] if plan.insert_elements !=None else None,
                                  alter_elements=plan.alter_elements)
        else:
            return SchemaExecutor(template_name=plan.template_source,
                                  create_elements=plan.create_elements,
                                  type_elements=plan.type_elements,
                                  insert_elements=plan.insert_elements if plan.insert_elements !=None else None,
                                  insert_source=plan.template_source[1:] if plan.insert_elements !=None else None,
                                  alter_elements=plan.alter_elements)
