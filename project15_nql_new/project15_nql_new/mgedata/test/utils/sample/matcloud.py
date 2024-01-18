template = {
    "_ord": [
        "systemType",
        "component"
    ],
    "component": {
        "r": False,
        "t": 9,
        "misc": {
            "_ord": [
                "label",
                "sample",
                "common"
            ],
            "label": {
                "r": False,
                "t": 1,
                "misc": {
                }
            },
            "common": {
                "r": False,
                "t": 9,
                "misc": {
                    "Time": {
                        "r": False,
                        "t": 9,
                        "misc": {
                            "_ord": [
                                "StartTime",
                                "EndTime"
                            ],
                            "EndTime": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "StartTime": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            }
                        }
                    },
                    "Tool": {
                        "r": False,
                        "t": 9,
                        "misc": {
                            "_ord": [
                                "Workflow",
                                "Activity",
                                "Toolbox"
                            ],
                            "Toolbox": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "Activity": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "Workflow": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            }
                        }
                    },
                    "Type": {
                        "r": False,
                        "t": 1,
                        "misc": {
                        }
                    },
                    "_ord": [
                        "Time",
                        "Resource",
                        "Files",
                        "Type",
                        "Tool"
                    ],
                    "Files": {
                        "r": False,
                        "t": 1,
                        "misc": {
                        }
                    },
                    "Resource": {
                        "r": False,
                        "t": 9,
                        "misc": {
                            "_ord": [
                                "Usage",
                                "Allocation"
                            ],
                            "Usage": {
                                "r": False,
                                "t": 9,
                                "misc": {
                                    "_ord": [
                                        "CpuTime",
                                        "WallTime",
                                        "Memory"
                                    ],
                                    "Memory": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "CpuTime": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "WallTime": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    }
                                }
                            },
                            "Allocation": {
                                "r": False,
                                "t": 9,
                                "misc": {
                                    "Task": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "_ord": [
                                        "Task",
                                        "Workflow",
                                        "Activity",
                                        "HpcCpuHours",
                                        "HpcMaxCores",
                                        "HpcMemory",
                                        "DateCreated",
                                        "HpcId",
                                        "ProcessesPerNode",
                                        "NumberOfNodes",
                                        "TotalCores"
                                    ],
                                    "HpcId": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "Activity": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "Workflow": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "HpcMemory": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "TotalCores": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "DateCreated": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "HpcCpuHours": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "HpcMaxCores": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "NumberOfNodes": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "ProcessesPerNode": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "sample": {
                "r": False,
                "t": 9,
                "misc": {
                    "_ord": [
                        "material",
                        "measurement",
                        "reference",
                        "contact",
                        "license"
                    ],
                    "contact": {
                        "r": False,
                        "t": 1,
                        "misc": {
                        }
                    },
                    "license": {
                        "r": False,
                        "t": 1,
                        "misc": {
                        }
                    },
                    "material": {
                        "r": False,
                        "t": 9,
                        "misc": {
                            "id": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "cif": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "_ord": [
                                "cheicalFormula",
                                "commonName",
                                "composition",
                                "condition",
                                "id",
                                "cif"
                            ],
                            "condition": {
                                "r": False,
                                "t": 9,
                                "misc": {
                                    "Type": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "_ord": [
                                        "Type",
                                        "NumberOfSpecies",
                                        "NumberOfSites",
                                        "LatticeParameters",
                                        "Lattice",
                                        "Volumn",
                                        "RecLattice",
                                        "SpaceGroup",
                                        "PointGroup",
                                        "CrystalFamily",
                                        "CrystalSystem",
                                        "LatticeSystem",
                                        "LatticeType",
                                        "Centering",
                                        "IsPrimitive",
                                        "ReducedSites",
                                        "Sites",
                                        "IsDisordered"
                                    ],
                                    "Sites": {
                                        "r": False,
                                        "t": 7,
                                        "misc": {
                                            "r": False,
                                            "t": 9,
                                            "misc": {
                                                "Atom": {
                                                    "r": False,
                                                    "t": 9,
                                                    "misc": {
                                                        "_ord": [
                                                            "AtomicNumber",
                                                            "MassNumber",
                                                            "Symbol"
                                                        ],
                                                        "Symbol": {
                                                            "r": False,
                                                            "t": 1,
                                                            "misc": {
                                                            }
                                                        },
                                                        "MassNumber": {
                                                            "r": False,
                                                            "t": 2,
                                                            "misc": {
                                                            }
                                                        },
                                                        "AtomicNumber": {
                                                            "r": False,
                                                            "t": 2,
                                                            "misc": {
                                                            }
                                                        }
                                                    }
                                                },
                                                "_ord": [
                                                    "Position",
                                                    "Atom"
                                                ],
                                                "Position": {
                                                    "r": False,
                                                    "t": 1,
                                                    "misc": {
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "Volumn": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "Lattice": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "Centering": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "PointGroup": {
                                        "r": False,
                                        "t": 9,
                                        "misc": {
                                            "_ord": [
                                                "Number",
                                                "Symbol",
                                                "ShortSymbol",
                                                "SchoenfliesSymbol"
                                            ],
                                            "Number": {
                                                "r": False,
                                                "t": 2,
                                                "misc": {
                                                }
                                            },
                                            "Symbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            },
                                            "ShortSymbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            },
                                            "SchoenfliesSymbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            }
                                        }
                                    },
                                    "RecLattice": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "SpaceGroup": {
                                        "r": False,
                                        "t": 9,
                                        "misc": {
                                            "_ord": [
                                                "Number",
                                                "Symbol",
                                                "LongSymbol",
                                                "ShortSymbol",
                                                "SchoenfliesSymbol"
                                            ],
                                            "Number": {
                                                "r": False,
                                                "t": 2,
                                                "misc": {
                                                }
                                            },
                                            "Symbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            },
                                            "LongSymbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            },
                                            "ShortSymbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            },
                                            "SchoenfliesSymbol": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            }
                                        }
                                    },
                                    "IsPrimitive": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "LatticeType": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "IsDisordered": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "ReducedSites": {
                                        "r": False,
                                        "t": 7,
                                        "misc": {
                                            "r": False,
                                            "t": 9,
                                            "misc": {
                                                "Atom": {
                                                    "r": False,
                                                    "t": 9,
                                                    "misc": {
                                                        "_ord": [
                                                            "AtomicNumber",
                                                            "MassNumber",
                                                            "Symbol"
                                                        ],
                                                        "Symbol": {
                                                            "r": False,
                                                            "t": 1,
                                                            "misc": {
                                                            }
                                                        },
                                                        "MassNumber": {
                                                            "r": False,
                                                            "t": 2,
                                                            "misc": {
                                                            }
                                                        },
                                                        "AtomicNumber": {
                                                            "r": False,
                                                            "t": 2,
                                                            "misc": {
                                                            }
                                                        }
                                                    }
                                                },
                                                "_ord": [
                                                    "Position",
                                                    "Atom"
                                                ],
                                                "Position": {
                                                    "r": False,
                                                    "t": 1,
                                                    "misc": {
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "CrystalFamily": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "CrystalSystem": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "LatticeSystem": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "NumberOfSites": {
                                        "r": False,
                                        "t": 2,
                                        "misc": {
                                        }
                                    },
                                    "NumberOfSpecies": {
                                        "r": False,
                                        "t": 2,
                                        "misc": {
                                        }
                                    },
                                    "LatticeParameters": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    }
                                }
                            },
                            "commonName": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "composition": {
                                "r": False,
                                "t": 9,
                                "misc": {
                                    "_ord": [
                                        "element",
                                        "weightPercent",
                                        "atomicPercent"
                                    ],
                                    "element": {
                                        "r": False,
                                        "t": 7,
                                        "misc": {
                                            "r": False,
                                            "t": 1,
                                            "misc": {
                                            }
                                        }
                                    },
                                    "atomicPercent": {
                                        "r": False,
                                        "t": 7,
                                        "misc": {
                                            "r": False,
                                            "t": 2,
                                            "misc": {
                                            }
                                        }
                                    },
                                    "weightPercent": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    }
                                }
                            },
                            "cheicalFormula": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            }
                        }
                    },
                    "reference": {
                        "r": False,
                        "t": 1,
                        "misc": {
                        }
                    },
                    "measurement": {
                        "r": False,
                        "t": 9,
                        "misc": {
                            "_ord": [
                                "property",
                                "condition",
                                "method",
                                "dataType",
                                "reference",
                                "contact",
                                "license"
                            ],
                            "method": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "contact": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "license": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "dataType": {
                                "r": False,
                                "t": 1,
                                "misc": {
                                }
                            },
                            "property": {
                                "r": False,
                                "t": 7,
                                "misc": {
                                    "r": False,
                                    "t": 9,
                                    "misc": {
                                        "_ord": [
                                            "name",
                                            "units",
                                            "scalar"
                                        ],
                                        "name": {
                                            "r": False,
                                            "t": 1,
                                            "misc": {
                                            }
                                        },
                                        "units": {
                                            "r": False,
                                            "t": 1,
                                            "misc": {
                                            }
                                        },
                                        "scalar": {
                                            "r": False,
                                            "t": 7,
                                            "misc": {
                                                "r": False,
                                                "t": 9,
                                                "misc": {
                                                    "_ord": [
                                                        "value"
                                                    ],
                                                    "value": {
                                                        "r": False,
                                                        "t": 1,
                                                        "misc": {
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "condition": {
                                "r": False,
                                "t": 7,
                                "misc": {
                                    "r": False,
                                    "t": 9,
                                    "misc": {
                                        "_ord": [
                                            "name",
                                            "units",
                                            "scalar"
                                        ],
                                        "name": {
                                            "r": False,
                                            "t": 1,
                                            "misc": {
                                            }
                                        },
                                        "units": {
                                            "r": False,
                                            "t": 1,
                                            "misc": {
                                            }
                                        },
                                        "scalar": {
                                            "r": False,
                                            "t": 7,
                                            "misc": {
                                                "r": False,
                                                "t": 9,
                                                "misc": {
                                                    "_ord": [
                                                        "value"
                                                    ],
                                                    "value": {
                                                        "r": False,
                                                        "t": 1,
                                                        "misc": {
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "reference": {
                                "r": False,
                                "t": 9,
                                "misc": {
                                    "doi": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "url": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "_ord": [
                                        "doi",
                                        "isbn",
                                        "issn",
                                        "url",
                                        "title",
                                        "publisher",
                                        "journal",
                                        "volume",
                                        "year",
                                        "issue",
                                        "pages",
                                        "author"
                                    ],
                                    "isbn": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "issn": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "year": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "issue": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "pages": {
                                        "r": False,
                                        "t": 9,
                                        "misc": {
                                            "end": {
                                                "r": False,
                                                "t": 1,
                                                "misc": {
                                                }
                                            },
                                            "_ord": [
                                                "start",
                                                "end"
                                            ],
                                            "start": {
                                                "r": False,
                                                "t": 2,
                                                "misc": {
                                                }
                                            }
                                        }
                                    },
                                    "title": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "author": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "volume": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "journal": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    },
                                    "publisher": {
                                        "r": False,
                                        "t": 1,
                                        "misc": {
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "systemType": {
        "r": False,
        "t": 1,
        "misc": {
        }
    }
}

data = [
    {
        "meta": {
            "title": "MatCloud 1",
            "abstract": "abstract",
            "keywords": "kwy"
        },
        "content": {
            "systemType": "Calculation",
            "component": {
                "label": "",
                "sample": {
                    "material": {
                        "commonName": "Nb",
                        "composition": {
                            "element": [
                                "Nb"
                            ],
                            "weightPercent": "",
                            "atomicPercent": [
                                1.0
                            ]
                        },
                        "condition": {
                            "Type": "Crystal",
                            "NumberOfSpecies": 1,
                            "NumberOfSites": 2,
                            "LatticeParameters": "[3.30543422, 3.30543422, 3.30543422, 90, 90, 90]",
                            "Lattice": "[[3.30543422, 0, 0], [0, 3.30543422, 0], [0, 0, 3.30543422]]",
                            "Volumn": "36.11482848227196",
                            "RecLattice": "[[0.30253211331490359, 0, 0], [0, 0.30253211331490359, 0], [0, 0, 0.30253211331490359]]",
                            "SpaceGroup": {
                                "Number": 229,
                                "Symbol": "I m -3 m",
                                "LongSymbol": "I 4/m -3 2/m",
                                "ShortSymbol": "Im-3m",
                                "SchoenfliesSymbol": "Oh^9"
                            },
                            "PointGroup": {
                                "Number": 229,
                                "Symbol": "I m -3 m",
                                "ShortSymbol": "Im-3m",
                                "SchoenfliesSymbol": "Oh^9"
                            },
                            "CrystalFamily": "Cubic",
                            "CrystalSystem": "Cubic",
                            "LatticeSystem": "Cubic",
                            "LatticeType": "BodyCenteredCubic",
                            "Centering": "BodyCentered",
                            "IsPrimitive": "false",
                            "ReducedSites": [

                            ],
                            "Sites": [

                            ],
                            "IsDisordered": "false"
                        },
                        "id": "5878594ce673b25d21594fde",
                        "cif": ""
                    },
                    "measurement": {
                        "property": [

                        ],
                        "condition": [
                            {
                                "name": "Precision",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "Normal"
                                    }
                                ]
                            },
                            {
                                "name": "XcFunctional",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "PAW_PBE"
                                    }
                                ]
                            },
                            {
                                "name": "IsSpinPolarized",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "false"
                                    }
                                ]
                            },
                            {
                                "name": "Electronic_EnergyCutoff",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "293.23500000000001"
                                    }
                                ]
                            },
                            {
                                "name": "Electronic_MinimumSteps",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "5"
                                    }
                                ]
                            },
                            {
                                "name": "Electronic_MaximumSteps",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "100"
                                    }
                                ]
                            },
                            {
                                "name": "Electronic_Algorithm",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "BlockedDavidsonIterationScheme"
                                    }
                                ]
                            },
                            {
                                "name": "Electronic_EnergyTolerance",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "0.0001"
                                    }
                                ]
                            },
                            {
                                "name": "Ionic_Algorithm",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "ConjugateGradient"
                                    }
                                ]
                            },
                            {
                                "name": "Ionic_RelaxIons",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "true"
                                    }
                                ]
                            },
                            {
                                "name": "Ionic_ChangeCellShape",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "true"
                                    }
                                ]
                            },
                            {
                                "name": "Ionic_ChangeCellVolume",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "true"
                                    }
                                ]
                            },
                            {
                                "name": "Ionic_MaximumSteps",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "200"
                                    }
                                ]
                            },
                            {
                                "name": "Ionic_EnergyTolerance",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "0.001"
                                    }
                                ]
                            },
                            {
                                "name": "DOS_Smearing",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "Gaussian"
                                    }
                                ]
                            },
                            {
                                "name": "DOS_SmearingWidth",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "0.02"
                                    }
                                ]
                            },
                            {
                                "name": "KPointGrid.Density",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "3000"
                                    }
                                ]
                            },
                            {
                                "name": "KPointGrid.ForceGammaCentered",
                                "units": "",
                                "scalar": [
                                    {
                                        "value": "false"
                                    }
                                ]
                            }
                        ],
                        "method": "LinuxIFC VASP 5.3.5 31Mar14 (build Nov 24 2016 18:32:54) complex                          parallel",
                        "dataType": "Computational",
                        "reference": {
                            "doi": "",
                            "isbn": "",
                            "issn": "",
                            "url": "",
                            "title": "",
                            "publisher": "",
                            "journal": "",
                            "volume": "",
                            "year": "2017-07-21",
                            "issue": "",
                            "pages": {
                                "start": 0,
                                "end": "0"
                            },
                            "author": "xushan.zhao@hotmail.com"
                        },
                        "contact": "xushan.zhao@hotmail.com",
                        "license": ""
                    },
                    "reference": "",
                    "contact": "",
                    "license": ""
                },
                "common": {
                    "Time": {
                        "StartTime": "2017-07-21T08:40:06Z",
                        "EndTime": "2017-07-21T08:41:11.623Z"
                    },
                    "Resource": {
                        "Usage": {
                            "CpuTime": "27.411999999999999",
                            "WallTime": "33.240000000000002",
                            "Memory": "44464"
                        },
                        "Allocation": {
                            "Task": "5971bddeb250ac46fbe1d6f6",
                            "Workflow": "5971bddeccf6e959469945de",
                            "Activity": "5971bddeccf6e959469945d7",
                            "HpcCpuHours": "2",
                            "HpcMaxCores": "4",
                            "HpcMemory": "10240",
                            "DateCreated": "2017-07-21T08:40:03.518Z",
                            "HpcId": "5848c36c31183e2314fedad7",
                            "ProcessesPerNode": "4",
                            "NumberOfNodes": "1",
                            "TotalCores": "4"
                        }
                    },
                    "Files": "[KPOINTS, vasprun.xml, XDATCAR, POSCAR, CHGCAR, CONTCAR, DOSCAR, WAVECAR, stderr, stdout, PCDAT, IBZKPT, CHG, INCAR, POTCAR, EIGENVAL, OUTCAR, OSZICAR]",
                    "Type": "Geometry Optimization",
                    "Tool": {
                        "Workflow": "5971bddeccf6e959469945de",
                        "Activity": "5971bddeccf6e959469945d7",
                        "Toolbox": "57874ea1149d3cb24d040656"
                    }
                }
            }
        }
    },
]
