// Words the robot can recognise (DoodleNet classes) that appear in the students' textbooks.
// Built from the LT1 / LT2 / NH5 / NH6 / Picture Dictionary vocab lists. Left out: colors, shapes, and anything too hard to draw.
// en: word shown to the student | ja/fu: Japanese and its reading, shown when time runs out | cls: DoodleNet label to match
// grades: school years (3-6) whose books contain the word (LT1=3, LT2=4, NH5=5, NH6=6, Picture Dictionary=5-6)
const WORDS = [
 {
  "en": "banana",
  "ja": "バナナ",
  "fu": "",
  "cls": "banana",
  "grades": [
   3,
   4,
   5,
   6
  ]
 },
 {
  "en": "baseball",
  "ja": "野球",
  "fu": "やきゅう",
  "cls": "baseball",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "basketball",
  "ja": "バスケットボール",
  "fu": "",
  "cls": "basketball",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "carrot",
  "ja": "にんじん",
  "fu": "",
  "cls": "carrot",
  "grades": [
   3,
   4,
   5,
   6
  ]
 },
 {
  "en": "cat",
  "ja": "猫",
  "fu": "ねこ",
  "cls": "cat",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "cow",
  "ja": "牛",
  "fu": "うし",
  "cls": "cow",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "dog",
  "ja": "犬",
  "fu": "いぬ",
  "cls": "dog",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "ear",
  "ja": "耳",
  "fu": "みみ",
  "cls": "ear",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "elephant",
  "ja": "象",
  "fu": "ぞう",
  "cls": "elephant",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "eye",
  "ja": "目",
  "fu": "め",
  "cls": "eye",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "horse",
  "ja": "馬",
  "fu": "うま",
  "cls": "horse",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "knee",
  "ja": "膝",
  "fu": "ひざ",
  "cls": "knee",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "monkey",
  "ja": "猿",
  "fu": "さる",
  "cls": "monkey",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "moon",
  "ja": "三日月",
  "fu": "みかづき",
  "cls": "moon",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "mouse",
  "ja": "鼠",
  "fu": "ねずみ",
  "cls": "mouse",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "mouth",
  "ja": "口",
  "fu": "くち",
  "cls": "mouth",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "nose",
  "ja": "鼻",
  "fu": "はな",
  "cls": "nose",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "onion",
  "ja": "玉ねぎ",
  "fu": "たまねぎ",
  "cls": "onion",
  "grades": [
   3,
   4,
   5,
   6
  ]
 },
 {
  "en": "owl",
  "ja": "梟",
  "fu": "ふくろう",
  "cls": "owl",
  "grades": [
   3
  ]
 },
 {
  "en": "panda",
  "ja": "パンダ",
  "fu": "",
  "cls": "panda",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "pineapple",
  "ja": "パイナップル",
  "fu": "",
  "cls": "pineapple",
  "grades": [
   3,
   4,
   5,
   6
  ]
 },
 {
  "en": "rabbit",
  "ja": "兎",
  "fu": "うさぎ",
  "cls": "rabbit",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "sheep",
  "ja": "羊",
  "fu": "ひつじ",
  "cls": "sheep",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "snake",
  "ja": "蛇",
  "fu": "へび",
  "cls": "snake",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "soccer",
  "ja": "サッカー",
  "fu": "",
  "cls": "soccer_ball",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "spider",
  "ja": "蜘蛛",
  "fu": "くも",
  "cls": "spider",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "strawberry",
  "ja": "いちご",
  "fu": "",
  "cls": "strawberry",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "tiger",
  "ja": "虎",
  "fu": "とら",
  "cls": "tiger",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "toe",
  "ja": "足の指",
  "fu": "あしのゆび",
  "cls": "toe",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "tree",
  "ja": "木",
  "fu": "き",
  "cls": "tree",
  "grades": [
   3,
   5,
   6
  ]
 },
 {
  "en": "apple",
  "ja": "りんご",
  "fu": "",
  "cls": "apple",
  "grades": [
   4,
   5,
   6
  ]
 },
 {
  "en": "hat",
  "ja": "帽子",
  "fu": "ぼうし",
  "cls": "hat",
  "grades": [
   4,
   5,
   6
  ]
 },
 {
  "en": "mushroom",
  "ja": "きのこ",
  "fu": "",
  "cls": "mushroom",
  "grades": [
   4,
   5,
   6
  ]
 },
 {
  "en": "pants",
  "ja": "ズボン",
  "fu": "",
  "cls": "pants",
  "grades": [
   4,
   5,
   6
  ]
 },
 {
  "en": "pencil",
  "ja": "鉛筆",
  "fu": "えんぴつ",
  "cls": "pencil",
  "grades": [
   4,
   5,
   6
  ]
 },
 {
  "en": "shorts",
  "ja": "短パン",
  "fu": "たんぱん",
  "cls": "shorts",
  "grades": [
   4
  ]
 },
 {
  "en": "airplane",
  "ja": "飛行機",
  "fu": "ひこうき",
  "cls": "airplane",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "ant",
  "ja": "蟻",
  "fu": "あり",
  "cls": "ant",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "arm",
  "ja": "腕",
  "fu": "うで",
  "cls": "arm",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bag",
  "ja": "かばん",
  "fu": "",
  "cls": "backpack",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "basket",
  "ja": "かご",
  "fu": "",
  "cls": "basket",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bat",
  "ja": "バット",
  "fu": "",
  "cls": "baseball_bat",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bath",
  "ja": "風呂",
  "fu": "ふろ",
  "cls": "bathtub",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bear",
  "ja": "熊",
  "fu": "くま",
  "cls": "bear",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bed",
  "ja": "ベッド",
  "fu": "",
  "cls": "bed",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bike",
  "ja": "自転車",
  "fu": "じてんしゃ",
  "cls": "bicycle",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bird",
  "ja": "鳥",
  "fu": "とり",
  "cls": "bird",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "boat",
  "ja": "ボート",
  "fu": "",
  "cls": "sailboat",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "book",
  "ja": "本",
  "fu": "ほん",
  "cls": "book",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bread",
  "ja": "パン",
  "fu": "",
  "cls": "bread",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bridge",
  "ja": "橋",
  "fu": "はし",
  "cls": "bridge",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "broccoli",
  "ja": "ブロッコリー",
  "fu": "",
  "cls": "broccoli",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bucket",
  "ja": "バケツ",
  "fu": "",
  "cls": "bucket",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "bus",
  "ja": "バス",
  "fu": "",
  "cls": "bus",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "butterfly",
  "ja": "蝶",
  "fu": "ちょう",
  "cls": "butterfly",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "cake",
  "ja": "ケーキ",
  "fu": "",
  "cls": "cake",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "camel",
  "ja": "ラクダ",
  "fu": "",
  "cls": "camel",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "camera",
  "ja": "カメラ",
  "fu": "",
  "cls": "camera",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "camping",
  "ja": "キャンプ",
  "fu": "",
  "cls": "tent",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "car",
  "ja": "車",
  "fu": "くるま",
  "cls": "car",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "castle",
  "ja": "城",
  "fu": "しろ",
  "cls": "castle",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "chair",
  "ja": "椅子",
  "fu": "いす",
  "cls": "chair",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "church",
  "ja": "教会",
  "fu": "きょうかい",
  "cls": "church",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "clock",
  "ja": "時計",
  "fu": "とけい",
  "cls": "clock",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "cloud",
  "ja": "雲",
  "fu": "くも",
  "cls": "cloud",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "coffee",
  "ja": "コーヒー",
  "fu": "",
  "cls": "coffee_cup",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "computer",
  "ja": "コンピューター",
  "fu": "",
  "cls": "computer",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "cookie",
  "ja": "クッキー",
  "fu": "",
  "cls": "cookie",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "crab",
  "ja": "蟹",
  "fu": "かに",
  "cls": "crab",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "crocodile",
  "ja": "ワニ",
  "fu": "",
  "cls": "crocodile",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "cup",
  "ja": "カップ",
  "fu": "",
  "cls": "cup",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "dolphin",
  "ja": "イルカ",
  "fu": "",
  "cls": "dolphin",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "donut",
  "ja": "ドーナツ",
  "fu": "",
  "cls": "donut",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "door",
  "ja": "ドア",
  "fu": "",
  "cls": "door",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "drum",
  "ja": "ドラム",
  "fu": "",
  "cls": "drums",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "duck",
  "ja": "鴨",
  "fu": "かも",
  "cls": "duck",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "elbow",
  "ja": "肘",
  "fu": "ひじ",
  "cls": "elbow",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "face",
  "ja": "顔",
  "fu": "かお",
  "cls": "face",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "fish",
  "ja": "魚",
  "fu": "さかな",
  "cls": "fish",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "flower",
  "ja": "花",
  "fu": "はな",
  "cls": "flower",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "fork",
  "ja": "フォーク",
  "fu": "",
  "cls": "fork",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "frog",
  "ja": "蛙",
  "fu": "かえる",
  "cls": "frog",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "giraffe",
  "ja": "キリン",
  "fu": "",
  "cls": "giraffe",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "glasses",
  "ja": "眼鏡",
  "fu": "めがね",
  "cls": "eyeglasses",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "grapes",
  "ja": "ぶどう",
  "fu": "",
  "cls": "grapes",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "guitar",
  "ja": "ギター",
  "fu": "",
  "cls": "guitar",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "hamburger",
  "ja": "ハンバーガー",
  "fu": "",
  "cls": "hamburger",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "hand",
  "ja": "手",
  "fu": "て",
  "cls": "hand",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "hot dog",
  "ja": "ホットドッグ",
  "fu": "",
  "cls": "hot_dog",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "house",
  "ja": "家",
  "fu": "いえ",
  "cls": "house",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "ice cream",
  "ja": "アイスクリーム",
  "fu": "",
  "cls": "ice_cream",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "kangaroo",
  "ja": "カンガルー",
  "fu": "",
  "cls": "kangaroo",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "key",
  "ja": "鍵",
  "fu": "かぎ",
  "cls": "key",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "lamp",
  "ja": "ランプ",
  "fu": "",
  "cls": "floor_lamp",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "leg",
  "ja": "脚",
  "fu": "あし",
  "cls": "leg",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "lion",
  "ja": "ライオン",
  "fu": "",
  "cls": "lion",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "mountain",
  "ja": "山",
  "fu": "やま",
  "cls": "mountain",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "mug",
  "ja": "マグカップ",
  "fu": "",
  "cls": "mug",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "octopus",
  "ja": "蛸",
  "fu": "たこ",
  "cls": "octopus",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "pear",
  "ja": "梨",
  "fu": "なし",
  "cls": "pear",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "penguin",
  "ja": "ペンギン",
  "fu": "",
  "cls": "penguin",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "piano",
  "ja": "ピアノ",
  "fu": "",
  "cls": "piano",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "pig",
  "ja": "豚",
  "fu": "ぶた",
  "cls": "pig",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "pizza",
  "ja": "ピザ",
  "fu": "",
  "cls": "pizza",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "racket",
  "ja": "ラケット",
  "fu": "",
  "cls": "tennis_racquet",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "rain",
  "ja": "雨",
  "fu": "あめ",
  "cls": "rain",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "rainbow",
  "ja": "虹",
  "fu": "にじ",
  "cls": "rainbow",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "river",
  "ja": "川",
  "fu": "かわ",
  "cls": "river",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "sandwich",
  "ja": "サンドイッチ",
  "fu": "",
  "cls": "sandwich",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "sea turtle",
  "ja": "海亀",
  "fu": "うみがめ",
  "cls": "sea_turtle",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "shark",
  "ja": "サメ",
  "fu": "",
  "cls": "shark",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "ship",
  "ja": "船",
  "fu": "ふね",
  "cls": "cruise_ship",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "shoe",
  "ja": "靴",
  "fu": "くつ",
  "cls": "shoe",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "smartphone",
  "ja": "スマートフォン",
  "fu": "",
  "cls": "cell_phone",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "snail",
  "ja": "カタツムリ",
  "fu": "",
  "cls": "snail",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "snow",
  "ja": "雪",
  "fu": "ゆき",
  "cls": "snowflake",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "sock",
  "ja": "靴下",
  "fu": "くつした",
  "cls": "sock",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "sofa",
  "ja": "ソファ",
  "fu": "",
  "cls": "couch",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "spoon",
  "ja": "スプーン",
  "fu": "",
  "cls": "spoon",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "sun",
  "ja": "太陽",
  "fu": "たいよう",
  "cls": "sun",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "swimming pool",
  "ja": "プール",
  "fu": "",
  "cls": "pool",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "T-shirt",
  "ja": "Tシャツ",
  "fu": "",
  "cls": "t-shirt",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "table",
  "ja": "テーブル",
  "fu": "",
  "cls": "table",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "teeth",
  "ja": "歯",
  "fu": "は",
  "cls": "tooth",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "telephone",
  "ja": "電話",
  "fu": "でんわ",
  "cls": "telephone",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "thunder",
  "ja": "雷",
  "fu": "かみなり",
  "cls": "lightning",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "traffic light",
  "ja": "信号",
  "fu": "しんごう",
  "cls": "traffic_light",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "train",
  "ja": "電車",
  "fu": "でんしゃ",
  "cls": "train",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "truck",
  "ja": "トラック",
  "fu": "",
  "cls": "truck",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "tv",
  "ja": "テレビ",
  "fu": "",
  "cls": "television",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "umbrella",
  "ja": "傘",
  "fu": "かさ",
  "cls": "umbrella",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "violin",
  "ja": "バイオリン",
  "fu": "",
  "cls": "violin",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "watch",
  "ja": "時計",
  "fu": "とけい",
  "cls": "wristwatch",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "watermelon",
  "ja": "スイカ",
  "fu": "",
  "cls": "watermelon",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "whale",
  "ja": "鯨",
  "fu": "くじら",
  "cls": "whale",
  "grades": [
   5,
   6
  ]
 },
 {
  "en": "zebra",
  "ja": "シマウマ",
  "fu": "",
  "cls": "zebra",
  "grades": [
   5,
   6
  ]
 }
];
