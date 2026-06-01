(function() {
    try {
        (function() {
            var visMeta = window.VWO._.visMeta;;
            var allSettings = (function() {
                return {
                    dataStore: {
                        campaigns: {
                            55: {
                                "version": 4,
                                "ep": 1778854365000,
                                "clickmap": 0,
                                "isAbtastyPushFormat": false,
                                "globalCode": [],
                                "type": "SPLIT_URL",
                                "status": "RUNNING",
                                "pc_traffic": 100,
                                "name": "v2 Pricing: Video Tooltip",
                                "manual": false,
                                "urlRegex": "^https\\:\\\/\\\/termly\\.io\\\/pricing(?:(\\?[^#]*))?(?:(#.*))?$",
                                "exclude_url": "",
                                "multiple_domains": 0,
                                "segment_code": "true",
                                "ss": null,
                                "ibe": 1,
                                "sections": {
                                    "1": {
                                        "path": "",
                                        "variations": {
                                            "1": "https:\/\/termly.io\/pricing",
                                            "2": "https:\/\/termly.io\/pricing-video"
                                        },
                                        "segment": {
                                            "1": 1,
                                            "2": 1
                                        },
                                        "variationsRegex": {
                                            "1": "^https\\:\\\/\\\/termly\\.io\\\/pricing\\\/?(?:[\\?#].*)?$",
                                            "2": "^https\\:\\\/\\\/termly\\.io\\\/pricing\\-video\\\/?(?:[\\?#].*)?$"
                                        },
                                        "urlModes": {
                                            "1": 1,
                                            "2": 1
                                        },
                                        "variation_names": {
                                            "1": "Control",
                                            "2": "Variation-1:-With-Video-tooltip"
                                        },
                                        "triggers": []
                                    }
                                },
                                "varSegAllowed": false,
                                "combs": {
                                    "1": 0.5,
                                    "2": 0.5
                                },
                                "comb_n": {
                                    "1": "Control",
                                    "2": "Variation-1:-With-Video-tooltip"
                                },
                                "goals": {
                                    "3": {
                                        "type": "REVENUE_TRACKING",
                                        "identifier": "termlyPurchase",
                                        "revenueProp": "price",
                                        "mca": false
                                    },
                                    "4": {
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "termlyPurchase",
                                        "mca": false
                                    },
                                    "5": {
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "signUp",
                                        "mca": false
                                    },
                                    "6": {
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "vwo_pageView",
                                        "mca": false
                                    },
                                    "7": {
                                        "url": ["link-planpro-annual", "link-planpro-monthly"],
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "vwo_dom_click",
                                        "mca": false
                                    },
                                    "8": {
                                        "url": ["link-planstarter-annual", "link-planstarter-monthly"],
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "vwo_dom_click",
                                        "mca": false
                                    },
                                    "9": {
                                        "url": ["link-planfree-annual", "link-planfree-monthly"],
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "vwo_dom_click",
                                        "mca": false
                                    },
                                    "10": {
                                        "url": "path[fill-rule=\"evenodd\"][clip-rule=\"evenodd\"][fill=\"#c2c8cf\"]",
                                        "type": "CUSTOM_GOAL",
                                        "identifier": "vwo_dom_click",
                                        "mca": false
                                    },
                                    "11": {
                                        "url": "path[fill-rule=\"evenodd\"][clip-rule=\"evenodd\"][fill=\"#c2c8cf\"]",
                                        "type": "REVENUE_TRACKING",
                                        "identifier": "vwo_dom_click",
                                        "revenueProp": "revenue",
                                        "mca": true
                                    }
                                },
                                "pgre": true,
                                "ps": true,
                                "metrics": [{
                                    "id": 3,
                                    "type": "m",
                                    "metricId": 2223682
                                }, {
                                    "id": 4,
                                    "type": "m",
                                    "metricId": 1763715
                                }, {
                                    "id": 5,
                                    "type": "m",
                                    "metricId": 1763709
                                }, {
                                    "id": 6,
                                    "type": "m",
                                    "metricId": 1763496
                                }, {
                                    "id": 7,
                                    "type": "m",
                                    "metricId": 1763400
                                }, {
                                    "id": 8,
                                    "type": "m",
                                    "metricId": 1763418
                                }, {
                                    "id": 9,
                                    "type": "m",
                                    "metricId": 1763466
                                }, {
                                    "id": 10,
                                    "type": "m",
                                    "metricId": 2497958
                                }, {
                                    "id": 11,
                                    "type": "m",
                                    "metricId": 2497967
                                }],
                                "sV": 1,
                                "cEV": 1,
                                "id": 55,
                                "triggers": ["25057088"],
                                "mt": {
                                    "3": "22982161",
                                    "4": "18082953",
                                    "5": "18082959",
                                    "6": "18082956",
                                    "7": "22436254",
                                    "8": "22436251",
                                    "9": "23207041",
                                    "10": "25057091",
                                    "11": "25057094"
                                }
                            }
                        },
                        changeSets: {},
                        plugins: {
                            "PIICONFIG": false,
                            "ACCTZ": "GMT",
                            "DACDNCONFIG": {
                                "IAF": false,
                                "SST": false,
                                "CSHS": false,
                                "UCP": false,
                                "aSM": true,
                                "sConfig": {
                                    "dClassVal": "(^elementor-)|elementor-|(^active)|active"
                                },
                                "eNC": false,
                                "PRTHD": false,
                                "BSECJ": false,
                                "SD": false,
                                "FB": false,
                                "DONT_IOS": false,
                                "SPA": true,
                                "DNDOFST": 1000,
                                "jsConfig": {
                                    "ivocpa": false,
                                    "ge": 1,
                                    "vqe": false,
                                    "ele": 1,
                                    "m360": 1,
                                    "ast": 1,
                                    "se": 1,
                                    "earc": 1
                                },
                                "debugEvt": false,
                                "AST": true,
                                "SCC": "{\"cache\":0}",
                                "CJ": false,
                                "CKLV": false,
                                "RDBG": false,
                                "CINSTJS": false,
                                "DLRE": false,
                                "CRECJS": false,
                                "SPAR": false
                            },
                            "LIBINFO": {
                                "DEBUGGER_UI": {
                                    "HASH": "dda4f9785f2dd92dc55ad5e22c352629br"
                                },
                                "DEBUGGER": {
                                    "HASH": ""
                                },
                                "EVAD": {
                                    "LIB_SUFFIX": "",
                                    "HASH": ""
                                },
                                "HEATMAP_HELPER": {
                                    "HASH": "afa99375a47e5e6dd91b1af7b8357bd1br"
                                },
                                "OPA": {
                                    "HASH": "47d5c150065e6be4440f5e75b903c9dbbr",
                                    "PATH": "\/4.0"
                                },
                                "SURVEY": {
                                    "HASH": "a74d86dbae8ab4655ab51135561f30a1br"
                                },
                                "WORKER": {
                                    "HASH": "70faafffa0475802f5ee03ca5ff74179br"
                                },
                                "SURVEY_HTML": {
                                    "HASH": "7039795edd8c22c13233e37718655a83br"
                                },
                                "SURVEY_DEBUG_EVENTS": {
                                    "HASH": "b6e70d9e26def669f61c97e4ed29aec3br"
                                }
                            }
                        },
                        vwoData: {
                            "gC": null,
                            "pR": []
                        },
                        crossDomain: {},
                        integrations: {},
                        events: {
                            "vwo_surveyClosed": {},
                            "vwo_appGoesInBackground": {},
                            "vwo_appLaunched": {},
                            "vwo_autoCapture": {},
                            "vwo_singleTap": {},
                            "vwo_survey_submit": {},
                            "vwo_screenViewed": {},
                            "vwo_customConversion": {},
                            "vwo_log": {},
                            "vwo_sdkDebug": {},
                            "vwo_widgetClose": {},
                            "vwo_surveyQuestionSubmitted": {
                                "ls": true
                            },
                            "vwo_dom_hover": {},
                            "vwo_surveyCompleted": {},
                            "vwo_fmeSdkInit": {},
                            "vwo_performance": {},
                            "vwo_repeatedScrolled": {},
                            "vwo_tabOut": {},
                            "vwo_tabIn": {},
                            "vwo_selection": {},
                            "vwo_pageRefreshed": {},
                            "vwo_cursorThrashed": {},
                            "vwo_recommendation_block_shown": {},
                            "vwo_errorOnPage": {},
                            "vwo_surveyExtraData": {},
                            "vwo_surveyQuestionDisplayed": {},
                            "vwo_surveyQuestionAttempted": {},
                            "vwo_pageUnload": {},
                            "signUp": {},
                            "vwo_appTerminated": {},
                            "vwo_appComesInForeground": {},
                            "vwo_networkChanged": {},
                            "vwo_zoom": {},
                            "vwo_longPress": {},
                            "vwo_fling": {},
                            "vwo_scroll": {},
                            "vwo_doubleTap": {},
                            "vwo_appNotResponding": {},
                            "vwo_appCrashed": {},
                            "vwo_page_session_count": {},
                            "vwo_rC": {},
                            "vwo_vA": {},
                            "vwo_survey_surveyCompleted": {},
                            "vwo_survey_reachedThankyou": {},
                            "vwo_survey_questionShown": {},
                            "vwo_survey_questionAttempted": {},
                            "vwo_survey_display": {},
                            "vwo_survey_close": {},
                            "vwo_survey_attempt": {},
                            "vwo_customTrigger": {},
                            "vwo_leaveIntent": {},
                            "vwo_conversion": {},
                            "vwo_attribute": {},
                            "vwo_jsBuildLog": {},
                            "vwo_dom_mouseDown": {},
                            "vwo_timer": {
                                "nS": ["timeSpent"]
                            },
                            "vwo_revenue": {},
                            "vwo_sessionSync": {},
                            "vwo_dom_scroll": {
                                "nS": ["pxBottom", "bottom", "top", "pxTop"]
                            },
                            "vwo_pageView": {},
                            "vwo_sdkUsageStats": {},
                            "abTastyCampaign": {},
                            "vwo_widgetShown": {},
                            "vwo_variationShown": {},
                            "vwo_survey_complete": {},
                            "vwo_debugLogs": {},
                            "termlyPurchase": {},
                            "vwo_dom_click": {
                                "nS": ["target.innerText", "target"]
                            },
                            "vwo_analyzeForm": {},
                            "vwo_trackGoalVisited": {},
                            "vwo_newSessionCreated": {},
                            "vwo_syncVisitorProp": {},
                            "vwo_surveyDisplayed": {},
                            "vwo_dom_submit": {},
                            "vwo_orientationChanged": {},
                            "vwo_analyzeHeatmap": {},
                            "vwo_analyzeRecording": {},
                            "vwo_goalVisit": {
                                "nS": ["expId"]
                            },
                            "vwo_dom_elementViewed": {},
                            "vwo_repeatedHovered": {},
                            "vwo_mouseout": {},
                            "vwo_copy": {},
                            "vwo_quickBack": {},
                            "vwo_surveyAttempted": {}
                        },
                        visitorProps: {
                            "vwo_email": {},
                            "vwo_domain": {},
                            "vwo_eaiSegment": {}
                        },
                        uuid: "D0ABB41BAAC740F557193843D2E8134CE",
                        syV: {},
                        syE: {},
                        cSE: {},
                        CIF: false,
                        syncEvent: "sessionCreated",
                        syncAttr: "sessionCreated"
                    },
                    sCIds: {},
                    oCids: {},
                    triggers: {
                        "22436254": {
                            "cnds": [{
                                "id": 1000,
                                "event": "vwo_dom_click",
                                "filters": [
                                    ["event.target", "sel", ".link-planpro-annual,.link-planpro-monthly"]
                                ]
                            }],
                            "dslv": 2
                        },
                        "22436251": {
                            "cnds": [{
                                "id": 1000,
                                "event": "vwo_dom_click",
                                "filters": [
                                    ["event.target", "sel", ".link-planstarter-annual,.link-planstarter-monthly"]
                                ]
                            }],
                            "dslv": 2
                        },
                        "23207041": {
                            "cnds": [{
                                "id": 1000,
                                "event": "vwo_dom_click",
                                "filters": [
                                    ["event.target", "sel", ".link-planfree-annual,.link-planfree-monthly"]
                                ]
                            }],
                            "dslv": 2
                        },
                        "25057091": {
                            "cnds": [{
                                "id": 1000,
                                "event": "vwo_dom_click",
                                "filters": [
                                    ["event.target", "sel", "path[fill-rule=\"evenodd\"][clip-rule=\"evenodd\"][fill=\"#c2c8cf\"]"]
                                ]
                            }],
                            "dslv": 2
                        },
                        "25057094": {
                            "cnds": [{
                                "id": 1000,
                                "event": "vwo_dom_click",
                                "filters": [
                                    ["event.target", "sel", "path[fill-rule=\"evenodd\"][clip-rule=\"evenodd\"][fill=\"#c2c8cf\"]"]
                                ]
                            }],
                            "dslv": 2
                        },
                        "2": {
                            "cnds": [{
                                "event": "vwo_variationShown",
                                "id": 100
                            }]
                        },
                        "75": {
                            "cnds": [{
                                "event": "vwo_urlChange",
                                "id": 99
                            }]
                        },
                        "11": {
                            "cnds": [{
                                "event": "vwo_dynDataFetched",
                                "id": 105,
                                "filters": [
                                    ["event.state", "eq", 1]
                                ]
                            }]
                        },
                        "5": {
                            "cnds": [{
                                "event": "vwo_postInit",
                                "id": 101
                            }]
                        },
                        "9": {
                            "cnds": [{
                                "event": "vwo_groupCampTriggered",
                                "id": 105
                            }]
                        },
                        "22982161": {
                            "cnds": [{
                                "id": 1000,
                                "event": "termlyPurchase",
                                "filters": []
                            }],
                            "dslv": 2
                        },
                        "8": {
                            "cnds": [{
                                "event": "vwo_pageView",
                                "id": 102
                            }]
                        },
                        "25057088": {
                            "cnds": ["o", ["a", {
                                    "id": 500,
                                    "event": "vwo_pageView",
                                    "filters": [
                                        ["storage.cookies._vis_opt_exp_55_split", "nbl"]
                                    ]
                                }, {
                                    "id": 504,
                                    "event": "vwo_pageView",
                                    "filters": [
                                        ["page.url", "urlReg", "^https\\:\\\/\\\/termly\\.io\\\/pricing\\-video\\\/?(?:[\\?#].*)?$"]
                                    ]
                                }],
                                ["a", {
                                    "event": "vwo_visibilityTriggered",
                                    "id": 5,
                                    "filters": []
                                }, {
                                    "id": 1000,
                                    "event": "vwo_pageView",
                                    "filters": []
                                }]
                            ],
                            "dslv": 2
                        },
                        "18082953": {
                            "cnds": [{
                                "id": 1000,
                                "event": "termlyPurchase",
                                "filters": []
                            }],
                            "dslv": 2
                        },
                        "18082959": {
                            "cnds": [{
                                "id": 1000,
                                "event": "signUp",
                                "filters": []
                            }],
                            "dslv": 2
                        },
                        "18082956": {
                            "cnds": [{
                                "id": 1000,
                                "event": "vwo_pageView",
                                "filters": [
                                    ["page.url", "pgc", "3502724"]
                                ]
                            }],
                            "dslv": 2
                        }
                    },
                    preTriggers: {},
                    tags: {},
                    rules: [{
                        "tags": [{
                            "metricId": 1763400,
                            "data": {
                                "campaigns": [{
                                    "g": 7,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["22436254"]
                    }, {
                        "tags": [{
                            "metricId": 1763418,
                            "data": {
                                "campaigns": [{
                                    "g": 8,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["22436251"]
                    }, {
                        "tags": [{
                            "metricId": 1763466,
                            "data": {
                                "campaigns": [{
                                    "g": 9,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["23207041"]
                    }, {
                        "tags": [{
                            "metricId": 2497958,
                            "data": {
                                "campaigns": [{
                                    "g": 10,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["25057091"]
                    }, {
                        "tags": [{
                            "metricId": 2497967,
                            "data": {
                                "campaigns": [{
                                    "g": 11,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["25057094"]
                    }, {
                        "tags": [{
                            "priority": 0,
                            "data": "campaigns.55",
                            "id": "runCampaign"
                        }],
                        "triggers": ["25057088"]
                    }, {
                        "tags": [{
                            "metricId": 2223682,
                            "data": {
                                "campaigns": [{
                                    "g": 3,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["22982161"]
                    }, {
                        "tags": [{
                            "metricId": 1763715,
                            "data": {
                                "campaigns": [{
                                    "g": 4,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["18082953"]
                    }, {
                        "tags": [{
                            "metricId": 1763709,
                            "data": {
                                "campaigns": [{
                                    "g": 5,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["18082959"]
                    }, {
                        "tags": [{
                            "metricId": 1763496,
                            "data": {
                                "campaigns": [{
                                    "g": 6,
                                    "c": 55
                                }],
                                "type": "m"
                            },
                            "id": "metric"
                        }],
                        "triggers": ["18082956"]
                    }, {
                        "tags": [{
                            "id": "checkEnvironment"
                        }],
                        "triggers": ["5"]
                    }, {
                        "tags": [{
                            "priority": 3,
                            "id": "prePostMutation"
                        }, {
                            "priority": 2,
                            "id": "groupCampaigns"
                        }],
                        "triggers": ["8"]
                    }, {
                        "tags": [{
                            "priority": 2,
                            "id": "visibilityService"
                        }],
                        "triggers": ["9"]
                    }, {
                        "tags": [{
                            "id": "runTestCampaign"
                        }],
                        "triggers": ["2"]
                    }, {
                        "tags": [{
                            "priority": 3,
                            "id": "revaluateHiding"
                        }],
                        "triggers": ["11"]
                    }, {
                        "tags": [{
                            "id": "urlChange"
                        }],
                        "triggers": ["75"]
                    }],
                    pages: {
                        "ec": [{
                            "3502724": {
                                "inc": ["o", ["url", "urlReg", "(?i).*https?\\:\\\/\\\/(w{3}\\.)?app\\.termly\\.io\\\/user\\\/checkout.*"]]
                            }
                        }, {
                            "3502727": {
                                "inc": ["o", ["url", "urlReg", "(?i).*"]]
                            }
                        }]
                    },
                    pagesEval: {},
                    stags: {},
                    domPath: {}
                }
            })();
            if (typeof window !== "undefined" && window._vwoFlow === "link-survey") {
                window.VWO._.rCS()
            };
            window.VWO.sTs = 1779094575;
            VWO.updateSettings(allSettings, 4);
            window.pushcrewHash = "";;
            (function() {
                var VWOOmniTemp = {};
                window.VWOOmni = window.VWOOmni || {};
                for (var key in VWOOmniTemp) Object.prototype.hasOwnProperty.call(VWOOmniTemp, key) && (window.VWOOmni[key] = VWOOmniTemp[key]);;
            })();
            (function() {
                window.VWO = window.VWO || [];
                var pollInterval = 100;
                var _vis_data = {};
                var intervalObj = {};
                var analyticsTimerObj = {};
                var experimentListObj = {};
                window.VWO.push(["onVariationApplied", function(data) {
                    if (!data) {
                        return
                    }
                    var expId = data[1],
                        variationId = data[2];
                    if (expId && variationId && ["VISUAL_AB", "VISUAL", "SPLIT_URL"].indexOf(window._vwo_exp[expId].type) > -1) {}
                }])
            })();;
        })()
    } catch (e) {
        window._vwo_code && window._vwo_code.finish();
        VWO._ && VWO._.customError && VWO._.customError({
            msg: e && e.message && e.message.substring(0, 1e3),
            source: "settings.js"
        })
    }
})();