from django.http import HttpRequest

from mgedata.utils.general import json_response


def material_method_view(request: HttpRequest):
    return json_response(
        [{"id": 65, "name": "其他", "children": []}, {"id": 66, "name": "计算模拟", "children": [
            {"id": 85, "name": "电子显微学实验的理论模拟与定量分析", "children": []},
            {"id": 88, "name": "相场模拟", "children": []}, {"id": 81, "name": "有限元模拟",
                                                             "children": [{"id": 82, "name": "Anysys", "children": []},
                                                                          {"id": 83, "name": "Abaqus", "children": []},
                                                                          {"id": 84, "name": "DEFORM",
                                                                           "children": []}]},
            {"id": 78, "name": "微观组织模拟", "children": [{"id": 79, "name": "Monte Carlo", "children": []},
                                                            {"id": 80, "name": "Cellular Automaton", "children": []}]},
            {"id": 73, "name": "计算热力学", "children": [{"id": 74, "name": "Thermocalc", "children": []},
                                                          {"id": 75, "name": "Pandat", "children": []}]},
            {"id": 70, "name": "分子动力学",
             "children": [{"id": 71, "name": "Lammps", "children": []}, {"id": 72, "name": "Namd", "children": []}]},
            {"id": 67, "name": "第一性原理",
             "children": [{"id": 68, "name": "VASP", "children": []}, {"id": 69, "name": "CASTEP", "children": []},
                          {"id": 86, "name": "AMS-Band", "children": []}, {"id": 89, "name": "Abinit", "children": []},
                          {"id": 90, "name": "DMol3", "children": []},
                          {"id": 92, "name": "Quantum ESPRESSO", "children": []}]},
            {"id": 76, "name": "计算动力学", "children": [{"id": 77, "name": "Dictra", "children": []}]}]},
         {"id": 64, "name": "生产", "children": []}, {"id": 63, "name": "实验", "children": []}])
