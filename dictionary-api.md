# Dictionary API Documentation

This API allows searching for word definitions and translations. It primarily fetches data from the Faztaa dictionary. If a word or phrase is not found in the dictionary, it automatically falls back to Google Translate to provide a translation.

## Endpoint

`GET /api/dictionary/search`

## Parameters

| Parameter     | Type     | Required | Default | Description                                                                 |
| :------------ | :------- | :------- | :------ | :-------------------------------------------------------------------------- |
| `word`        | `string` | Yes      | -       | The word or phrase to search for.                                           |
| `source_lang` | `string` | No       | `de`    | The source language of the input word. Supported values: `de` (German), `vi` (Vietnamese). |

## Behavior

1.  **Dictionary Search**: The API first attempts to look up the word in the Faztaa dictionary using the appropriate language pair (German-Vietnamese or Vietnamese-German).
2.  **Fallback**: If the dictionary returns no results (`found: false`), the API automatically queries Google Translate to get a translation.
    *   If `source_lang` is `vi`, it translates from Vietnamese to German.
    *   If `source_lang` is `de`, it translates from German to Vietnamese.

## Response Format

The response is a JSON object. The structure depends on whether the word was found in the dictionary or translated via Google Translate, but the key fields remain consistent.

### Scenario 1: Word Found in Dictionary

```json
{
  "found": true,
  "key": "Hallo",
  "result": [
    {
      "word": "hallo",
      "id": 69955,
      "language": "en", // Internal Faztaa code
      "type": "devi",   // Dictionary pair (devi = DE -> VI)
      "content": [
        {
          "kind": "Interjection (2)", // Part of speech
          "means": [
            {
              "mean": "hello, hi!",
              "examples": [
                {
                  "e": "Hallo! Ist Herr Freeman da?",
                  "m": "Hello, is Mr Freeman in?"
                }
              ]
            }
          ]
        }
      ],
      "pronounce": {
        "de": "hˈaloː"
      }
    }
  ]
}
```

### Scenario 2: Word Not Found (Google Translate Fallback)

When the dictionary lookup fails, the API returns a constructed response using the translation. Note the `type: "google_translate"` and the `kind` field indicating the source.

```json
{"statusCode":200,"message":"Success","data":{"found":true,"key":"reisen","result":[{"word":"reisen","freq":0.0000479,"topic":"6","word_grammar":{"conj":1,"phr":1},"keyword":"gereist, reis, reise, reisend, reisest, reiset, reist, reiste, reisten, reistest, reistet","word_family":[{"field":"related","content":["reise","reiste","unterwegs","fahrt","begleiten","dorthin","zurück"]}],"snym":null,"id":82020,"language":"vi","type":"devi","content":[{"kind":"động từ","means":[{"mean":"đi du lịch, đi xa","examples":[{"id":53907,"language":"vi","m":"đi xa ngày đêm","p":null,"type":"example","_id":"99846949b80e341c0104af9441ff4b70","e":"Tag und Nacht reisen"},{"id":53908,"language":"vi","m":"đi xa một ngày và hai đêm","p":null,"type":"example","_id":"2407f4a6a66aa3d1058a50eed32d3803","e":"einen Tag und zwei Nächte reisen"},{"id":53909,"language":"vi","m":"<tục ngữ> đi xa học khôn","p":null,"type":"example","_id":"d0992683db4f03e8c81e22deff50cb42","e":"Reisen bildet"},{"id":53910,"language":"vi","m":"đi xa thoải mái (khó nhọc, chậm chạp, nhanh chóng, phức tạp)","p":null,"type":"example","_id":"3ae1df3ffc1c35d8b1f629d46afa4b74","e":"bequem (beschwerlich, langsam, schnell, umstänadlich) reisen"},{"id":53911,"language":"vi","m":"đi công tác (công vụ)","p":null,"type":"example","_id":"2eccfa0051d2f3bedf5fab53a60f1e7f","e":"dienstlich (geschäftlich) reisen"},{"id":53912,"language":"vi","m":"ra đi một cách bí mật (dưới một tên khác)","p":null,"type":"example","_id":"ed265eb7f7c91c77a4ed4755cc007008","e":"inkognito reisen"},{"id":53913,"language":"vi","m":"ông ấy đi xa nhiều","p":null,"type":"example","_id":"885f758a5079ce43476840c38fd99595","e":"er ist schon viel gereist"},{"id":53914,"language":"vi","m":"đi xa (du lịch) một mình","p":null,"type":"example","_id":"e407677004b296999c7f29dd6718534b","e":"allein reisen"},{"id":53915,"language":"vi","m":"đi công tác ngoại giao","p":null,"type":"example","_id":"1295087d1a5e5402167689f37370c0d8","e":"als Diplomat reisen"},{"id":53916,"language":"vi","m":"đi du lịch miền quê","p":null,"type":"example","_id":"ad6fcdcea4796f334278eeefc1df09d8","e":"aufs Land reisen"}]},{"mean":"`","examples":[{"id":53917,"language":"vi","m":"hắn ta luôn luôn chọn trò (thói) này (để đạt được cái gì) (khẩu ngữ)","p":null,"type":"example","_id":"1888db474cf6300f67b57d66f5a56b00","e":"auf diese (dumme) Tour reist er immer"},{"id":53918,"language":"vi","m":"đi du lịch xuyên qua nước Ý","p":null,"type":"example","_id":"91ae083faaf5eb7901ce7e1102038997","e":"durch Italien reisen"},{"id":53919,"language":"vi","m":"đi xa nghỉ hè (nghỉ ngơi)","p":null,"type":"example","_id":"43cc67bce3ce45f2b20a0ffd57e3ae08","e":"in die Ferien (den Urlaub) reisen"},{"id":53920,"language":"vi","m":"đi du lịch tập thể","p":null,"type":"example","_id":"6ed697f2bf6ae35badd5f59d90b03348","e":"in Gesellschaft reisen"},{"id":53921,"language":"vi","m":"đi du lịch đến chỗ nghỉ dưỡng bệnh","p":null,"type":"example","_id":"235fbdcf9d09cf8eafb832fe1798c397","e":"in ein Kurbad reisen"},{"id":53922,"language":"vi","m":"đi du lịch đến Thụy Sĩ","p":null,"type":"example","_id":"b558353533503d8b7ecebf1be113a13c","e":"in die Schweiz reisen"},{"id":53923,"language":"vi","m":"đi bán hàng dạo","p":null,"type":"example","_id":"91503ae95221f07e4aef85f64f8b91b6","e":"in Stoffen reisen"},{"id":53924,"language":"vi","m":"đi du lịch bằng xe lửa (máy bay, tàu thủy, xe riêng)","p":null,"type":"example","_id":"c0051c9ce9e53eb6e20e8d9c64651c73","e":"mit der Bahn (mit dem Flugzeug, dem Schiff, mit dem eigegen Wagen) reisen"},{"id":53925,"language":"vi","m":"đi du lịch thành phố La Mã","p":null,"type":"example","_id":"7cda4b800d4c7782cac79ba7cf601e2b","e":"nach Rom reisen"},{"id":53926,"language":"vi","m":"đi từ Hamburg qua Frankfurt đến München","p":null,"type":"example","_id":"e356f10d4bb1d174d912f57900a93425","e":"von Hamburg über Frankfurt nach München reisen"},{"id":53927,"language":"vi","m":"đi du lịch nghỉ ngơi","p":null,"type":"example","_id":"070a1d9a0db6006465a4e7f08abab867","e":"zur Erholung reisen"},{"id":53928,"language":"vi","m":"đi du lịch giải trí","p":null,"type":"example","_id":"61ee19cdba6ff075b84d84dfff79f193","e":"zum Vergnügen reisen"},{"id":53929,"language":"vi","m":"để bổ túc cho kiến thức tiếng Anh, ông ta đã đi du lịch Luân Đôn trong vài tuần lễ","p":null,"type":"example","_id":"0fb42de461c96aabeaa4215d07ea69f6","e":"zur Vervollkommung seiner englischen Sprachkenntnisse reist er für einige Wochen nach London"},{"id":53930,"language":"vi","m":"đi du lịch hai người","p":null,"type":"example","_id":"356133bad6702481ba99438b64921eb1","e":"zu zweien reisen"},{"id":53931,"language":"vi","m":"người thương gia bán hàng rong","p":null,"type":"example","_id":"0e04e3c30815212d15434d3866420f39","e":"reisende Kaufleute"}]},{"mean":"khởi hành","examples":[{"id":53932,"language":"vi","m":"tôi khởi hành ngày hôm nay (ngày mai, tuần tới)","p":null,"type":"example","_id":"c80031df5912953e5ecd930066913308","e":"ich reise heute (morgen, nächste Woche)"}]},{"mean":"<cũng có nghĩa> đi xe","examples":[{"id":53933,"language":"vi","m":"đi xe hạng nhất (nhì)","p":null,"type":"example","_id":"1918cbffdee842a36649a61adddc6778","e":"erster (zweiter) Klasse reisen"},{"id":53934,"language":"vi","m":"<xe lửa> đi toa xe ngủ","p":null,"type":"example","_id":"0f8bf2043c2619b93e675b1272a961f3","e":"im Liegewagen reisen"}]}]}],"_id":"658a08653ff4f79f9efd5e723633b8eb","pronounce":{"de":"rˈaɪzən"},"conjugation":null},{"word":"Reise","freq":0.0000794,"topic":"19","word_grammar":{"phr":1},"keyword":"reisen","word_family":[{"field":"related","content":["reisen","fahrt","unterwegs","reiste","suche","zurück","dorthin","abreise","ins","weg","flucht","nacht","besuch","überfahrt","nach","buch"]}],"snym":[{"kind":"","content":[{"syno":[["Ausflug","Trip"]]}]}],"id":81987,"language":"vi","type":"devi","content":[{"kind":"danh từ","means":[{"mean":"chuyến (cuộc) du lịch, chuyến đi xa","examples":[{"id":53884,"language":"vi","m":"cắt ngang (bắt đầu, chấm dứt, gián đoạn) chuyến du lịch","p":null,"type":"example","_id":"4a79cc59d164867b2776d09874e56ea8","e":"eine Reise abbrechen (antreten, beenden unterbrechen"},{"id":53885,"language":"vi","m":"hoạch định (dời lại, có ý định) du lịch","p":null,"type":"example","_id":"a40a88eea954a7e8f12d1c034ff9863c","e":"eine Reise planen (verschieben, vorhaben)"},{"id":53886,"language":"vi","m":"một chuyến du lịch thoải mái (trở ngại, ngắn, dài, xa)","p":null,"type":"example","_id":"3ba874935804b111080d725c39b4b15d","e":"eine angenehme (beschwerliche, kurze, lange, weite) Reise"},{"id":53887,"language":"vi","m":"chúc người nào một cuộc du lịch may mắn","p":null,"type":"example","_id":"3cb91ecca40f63b7d6dd621decc03dd2","e":"jmdm. glückliche Reise wünschen"},{"id":53888,"language":"vi","m":"<lời chúc> chúc đi may mắn!","p":null,"type":"example","_id":"3f22e80b7c6908fc24eb52c0693dbb54","e":"gute Reise!, glückliche Reise!"},{"id":53889,"language":"vi","m":"từ trần, qua đời","p":null,"type":"example","_id":"341f3e37cb3f0f6eedcfb1840ece069a","e":"die letzte Reise antreten"},{"id":53890,"language":"vi","m":"bắt đầu chuyến du lịch","p":null,"type":"example","_id":"0a486dfc9ab35e5f8e336a5589e638ff","e":"sich auf die Reise begehen"},{"id":53891,"language":"vi","m":"đi du lịch","p":null,"type":"example","_id":"43eaf8fa0aff5dda0def90ad324fa5b3","e":"auf Reisen gehen"},{"id":53892,"language":"vi","m":"ông ấy đi xa (công tác) nhiều","p":null,"type":"example","_id":"2840d08bc4cc46ce279f546bdf506201","e":"er ist (geschäftlich) viel auf Reisen"},{"id":53893,"language":"vi","m":"trên đường đi đến Stuttgart chúng tôi đã gặp…","p":null,"type":"example","_id":"0b6bec86957fe4534ecf4a72bf28d8d6","e":"auf der Reise nach Stuttgart trafen wir unterwegs…"},{"id":53894,"language":"vi","m":"sắp từ trần (qua đời)","p":null,"type":"example","_id":"e900139fce78f404ee10aeb9c324ebf2","e":"auf die große (letzte) Reise gehen"},{"id":53895,"language":"vi","m":"chúng tôi vừa mới có một chuyến đi xa","p":null,"type":"example","_id":"92d24fd595e431cdde7c4fd55b115823","e":"wir haben eine weite Reise hinter uns"},{"id":53896,"language":"vi","m":"một chuyến đi du lịch bằng xe lửa (xe buýt, máy bay, tàu thủy, xe hơi)","p":null,"type":"example","_id":"ea1dd925292799cc0267dae83bd63c3a","e":"eine Reise mit der Bahn (dem Bus, dem Flugzeug, dem Schiff, dem Kraftwagen)"},{"id":53897,"language":"vi","m":"anh ấy vừa mới đi du lịch xa trở về","p":null,"type":"example","_id":"fa88f8a42d8abbf6363e9af64c3e09f1","e":"er ist soeben von der Reise zurückgekommen"},{"id":53898,"language":"vi","m":"một chuyến du lịch bằng tàu thủy","p":null,"type":"example","_id":"e86334086052447bf661ed5313cb88dc","e":"eine Reise zu Schiff"},{"id":53899,"language":"vi","m":"chuẩn bị cho một chuyến du lịch","p":null,"type":"example","_id":"041f4cab243193eabfbc36b6cc9fe725","e":"Vorbereitungen zur Reise treffen"},{"id":53900,"language":"vi","m":"chuyến du lịch như thế nào?","p":null,"type":"example","_id":"991dd3d74553d87f86def7e3b05fb4ce","e":"wie war die Riese?"},{"id":53901,"language":"vi","m":"chuyến du lịch đi đâu?","p":null,"type":"example","_id":"640c4271f8112a2c169408a5ba6af639","e":"wohin geht die Reise?"}]},{"mean":"đoạn đường xa (giễu cợt)","examples":[{"id":53902,"language":"vi","m":"mỗi lần đến ông ta là một đoạn đường dài (khẩu ngữ)","p":null,"type":"example","_id":"837d1bd1fec9b4b7d3a56426ef2e50f6","e":"bis zu ihm ist es jedesmal eine ganze Reise"}]},{"mean":"than siêu sạch, than hảo hạng","examples":[]}]}],"_id":"dc6f4a48f65d13f54e5fd944a078f264","pronounce":{"de":"rˈaɪzə"},"conjugation":{"gt":{"w":"die","p":""},"si":{"w":"Reise","p":"rˈaɪzə"},"sn":{"w":"Reisen","p":"rˈaɪzən"}}},{"word":"Reis","freq":"0.0000138","topic":"34, 66","word_grammar":{"phr":1},"keyword":"reise, reisen, reiser, reisern, reises","word_family":null,"snym":null,"id":81979,"language":"vi","type":"devi","content":[{"kind":"danh từ","means":[{"mean":"<số nhiều của> Real","examples":[]},{"mean":"cành cây non, mầm non","examples":[{"id":53879,"language":"vi","m":"một bó cành cây non","p":null,"type":"example","_id":"243194ab2bbdf404f050dfd8bf4f4625","e":"ein Bündel Reiser"},{"id":53880,"language":"vi","m":"một cành cây non để chiết cành","p":null,"type":"example","_id":"50653ce7dfcb81f5957c6e00e28377c5","e":"ein junges Reis zum Okulieren"},{"id":53881,"language":"vi","m":"một giòng máu mới trong một gia đình","p":null,"type":"example","_id":"da5df994f25709c083c769130dcafdbb","e":"ein neues Reis am alten Stamm"},{"id":53882,"language":"vi","m":"<tục ngữ> đoàn kết gây sức mạnh","p":null,"type":"example","_id":"39b33632be8f1cfb7a8b661a9f65eef1","e":"viel Reiser machen einen Besen"}]},{"mean":"cây lúa gạo, Oryza sativa","examples":[]},{"mean":"<cũng có nghĩa> hạt cơm","examples":[{"id":53883,"language":"vi","m":"cơm gà","p":null,"type":"example","_id":"a1e6a0fb7e0e4c5e6c062ac6db71064f","e":"Reis mit Huhn"}]}]}],"_id":"c1210e66c3a08e5148bac7009fb10453","pronounce":{"de":"rˈaɪs"},"conjugation":{"gt":{"w":"der","p":null},"si":{"w":"Reises","p":"rˈaɪzəs"},"sn":{"w":"Reise","p":"rˈaɪzɜ"}}},{"word":"hierher reisen","freq":0.0000109,"topic":"","keyword":null,"word_family":null,"snym":null,"id":120456,"language":"vi","type":"devi","content":[{"kind":"","means":[{"mean":"đi du lịch (du hành) đến đây","examples":[]}]}],"_id":"f057d4251145f4a2acecaf88de1a9efc","pronounce":{"de":"hˈiːɾhɜ rˈaɪzən"},"conjugation":null},{"word":"Reisen im Weltall","freq":0.00000316,"topic":"","keyword":null,"word_family":null,"snym":null,"id":167492,"language":"vi","type":"devi","content":[{"kind":"","means":[{"mean":"cuộc hành trình trong không gian","examples":[]}]}],"_id":"f58e5b1be64d9cff4ba912888987f65e","pronounce":{"de":"rˈaɪzən ɪm vˈɛltal"},"conjugation":null}]}}
```

### Scenario 3: Word Not Found (No Translation Available)

If both the dictionary and Google Translate fail to provide a result.

```json
{
  "found": false,
  "key": "some_random_string",
  "result": [] // May contain partial matches or be empty
}
```

## Example Usage

### Search for a German word (Default)
```bash
curl "http://localhost:3000/api/dictionary/search?word=Hallo"
```

### Search for a Vietnamese word
```bash
curl "http://localhost:3000/api/dictionary/search?word=chào&source_lang=vi"
```

### Search for a phrase (triggers fallback if not in dict)
```bash
curl "http://localhost:3000/api/dictionary/search?word=Gà%20nướng&source_lang=vi"
```
