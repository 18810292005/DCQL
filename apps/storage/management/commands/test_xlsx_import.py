from django.core.management.base import BaseCommand
# from apps.storage.transform.dataset.xlsx import XlsxFileToXlsxDict, XlsxDictToXlsxDictList, \
#     OneDataXlsxDictToDataV1


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('--xlsx', type=str)

    # def handle(self, *args, **options):
    #     xlsx_dict = XlsxFileToXlsxDict(options['xlsx']).to()
    #     # print(json.dumps(XlsxFileToXlsxDict(options['xlsx']).to(), indent=2))
    #     xlsx_dict_list = XlsxDictToXlsxDictList(xlsx_dict).to()
    #     # print(
    #     #     json.dumps(
    #     #         XlsxDictToXlsxDictList(XlsxFileToXlsxDict(options['xlsx']).to()).to()[1],
    #     #         indent=2
    #     #     )
    #     # )
    #
    #     print(
    #         OneDataXlsxDictToDataV1(
    #             xlsx_dict_list[1]
    #         ).to()
    #     )
