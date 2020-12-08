/*
 * @Author: zhoualnglang 
 * @Date: 2020-05-23 17:13:40 
 * @Last Modified by: zhoulanglang
 * @Last Modified time: 2020-05-23 17:16:45
 */
class HieroglyphData {
    public static readonly URL = 'resource/config/json/spritesheets/hieroglyph.json'

    public static readonly WH = [
        { w: 374, h: 377 },
        { w: 374, h: 377 },
        { w: 374, h: 377 },
        { w: 374, h: 377 },
    ]

    public static readonly Button = ["button00", "button01", "button02", "button03", "button04"]
    public static readonly Button_Icon = [
        ["button00_icon00", "button00_icon01", "button00_icon02", "button00_icon03", "button00_icon04"],
        ["button01_icon00", "button01_icon01", "button01_icon02", "button01_icon03", "button01_icon04"],
        ["button02_icon00", "button02_icon01", "button02_icon02", "button02_icon03"],
        ["button03_icon00", "button03_icon01", "button03_icon02", "button03_icon03"],
        ["button04_ramp", "button04_border"]
    ]

    public static readonly Layer_Img = [
        [['layer00_00_00'], ['layer00_01_00'], ['layer00_02_00'], ['layer00_03_00']],
        [['layer01_00_00', 'layer01_00_01', 'layer01_00_02'], ['layer01_01_00'], ['layer01_02_00', 'layer01_02_01'], ['layer01_03_00', 'layer01_03_01'], ['layer01_04_00', 'layer01_04_01', 'layer01_04_02']],
        [['layer02_00_00'], ['layer02_01_00', 'layer02_01_01'], ['layer02_02_00', 'layer02_02_01'], ['layer02_03_00'], ['layer02_04_00', 'layer02_04_01']],
    ]

    public static readonly COLOR = [
        null,
        [
            0.6, 0, 0, 0, 100,
            0, 0.6, 0, 0, 0,
            0, 0, 0.6, 0, 0,
            0, 0, 0, 1, 0
        ],
        [
            0.6, 0, 0, 0, 0,
            0, 0.6, 0, 0, 100,
            0, 0, 0.6, 0, 0,
            0, 0, 0, 1, 0
        ],
        [
            0.6, 0, 0, 0, 0,
            0, 0.6, 0, 0, 0,
            0, 0, 0.6, 0, 100,
            0, 0, 0, 1, 0
        ],
        [
            0.6, 0, 0, 0, 0,
            0, 0.6, 0, 0, 100,
            0, 0, 0.6, 0, 100,
            0, 0, 0, 1, 0
        ],
        [
            0.6, 0, 0, 0, 100,
            0, 0.6, 0, 0, 0,
            0, 0, 0.6, 0, 100,
            0, 0, 0, 1, 0
        ],
        [
            0.6, 0, 0, 0, 100,
            0, 0.6, 0, 0, 100,
            0, 0, 0.6, 0, 0,
            0, 0, 0, 1, 0
        ],
    ]

    public static readonly Weather = {
        "rain": [
            "rain_00",
            "rain_01",
            "rain_02"
        ],
        "wind": [
            "wind_00",
            "wind_01",
            "wind_02",
            "wind_03",
            "wind_04",
            "wind_05",
            "wind_06",
            "wind_07"
        ]
    }
}
window["HieroglyphData"] = HieroglyphData;