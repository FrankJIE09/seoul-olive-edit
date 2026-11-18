import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const research = JSON.parse(readFileSync(new URL('./research.json', import.meta.url), 'utf8'));
const additions = JSON.parse(readFileSync(new URL('./research-additions.json', import.meta.url), 'utf8'));
research.products.push(...additions.products);
const edits = {
  'torriden-solid-in-lip-essence': { name:'SOLID IN 神经酰胺唇部精华', category:'lips', skin:[], purposes:['self','gift'], label:'韩国分榜热度线索', tags:['11/16 分榜 #2','11ml 无需选色'], reason:'平时会用唇部护理、想找一支随身小物的人可以先看；页面榜单名次只是当周购买线索。', giftAdvice:'比底妆更不用猜色号，但仍要确认对方会用唇部产品并接受其成分和触感。', evidence:'选品线索：Olive Young韩国商品页与2026年11月16日韩国销售榜资料；不是小红书具体SKU实测，榜单也不代表个人适用。', evidenceUrl:'https://theseoulbeautyreport.com/rankings/weekly-2026-11-16/', evidenceLabel:'韩国销售榜资料（11月16日）' },
  'longtake-hair-oil-kit': { name:'香氛护发油企划', category:'hairbody', skin:['hair'], purposes:['self','gift'], label:'韩国护发榜第 5', tags:['11/16 护发榜 #5','三款香型'], reason:'已经会用免洗护发油、想比较香味与发尾触感时考虑；可先试少量再决定。', giftAdvice:'适合明确有护发习惯、也喜欢其中一款香味的人；香味敏感或细软发先试用。', evidence:'选品线索：Olive Young韩国商品页核对40ml＋15ml企划；The Seoul Beauty Report记录的2026年11月16日韩国护发榜第5。排名会变化，不代表个体适用。', evidenceUrl:'https://theseoulbeautyreport.com/rankings/hair/', evidenceLabel:'韩国护发榜（11月16日）' },
  'hetras-mango-hand-cream': { name:'Mango Seed Butter 香氛护手霜', category:'hairbody', skin:[], purposes:['self','gift'], label:'8 款香型 · 礼物备选', tags:['11/16 新入榜 #25','50ml 先闻香'], reason:'50ml便携、预算较轻，适合想带一支护手霜小礼的人；建议在店里闻过再选。', giftAdvice:'仅在知道对方喜欢香氛或能一起挑香型时送；香味敏感者不建议盲送。', evidence:'选品线索：Olive Young韩国商品页当期列8款、查询日起价；韩国榜单于2026年11月16日记录为新入榜第25。榜单与香型偏好无关。', evidenceUrl:'https://theseoulbeautyreport.com/rankings/weekly-2026-11-16/', evidenceLabel:'韩国销售榜资料（11月16日）' },
  'celimax-retinal-shot-kit': { name:'The Vita A Retinal Shot 进阶精华', category:'skincare', skin:[], purposes:['self'], label:'进阶自用 · 榜单第 5', tags:['11/16 总榜 #5','按标签谨慎使用'], reason:'这是一项进阶自用选择，只适合主动想尝试、会认真查看成分与使用说明的人；不是新手入门或礼物首选。', giftAdvice:'不建议送人；护肤习惯、活性成分耐受和正在使用的产品都需要本人确认。', evidence:'Olive Young韩国商品页列15ml正装与当期小样企划；The Seoul Beauty Report记录其2026年11月16日韩国销售总榜第5。热度不等于功效或适用性。', evidenceUrl:'https://theseoulbeautyreport.com/rankings/weekly-2026-11-16/', evidenceLabel:'韩国销售榜资料（11月16日）' },
  'bioheal-probioderm-cream': { name:'Probioderm 3D Lifting Cream 面霜', category:'skincare', skin:[], purposes:['self'], label:'当周面霜榜单线索', tags:['11/16 总榜 #9','50ml 单品 / 企划'], reason:'平时会用面霜、想在店里比较滋润度时可看；先核对单品和按摩板企划的规格、预算差异。', giftAdvice:'面霜较挑肤感与成分偏好，适合自用试过后再决定，不建议盲送。', evidence:'Olive Young韩国商品页提供50ml单品与按摩板企划选项；韩国销售榜资料记录该系列于2026年11月16日列总榜第9。排名不保证适合个人。', evidenceUrl:'https://theseoulbeautyreport.com/rankings/weekly-2026-11-16/', evidenceLabel:'韩国销售榜资料（11月16日）' },
  'skin1004-waterfit-sunscreen': { name:'Water-Fit 轻薄防晒精华', category:'sunscreen', skin:[], purposes:['self'], label:'官方榜单备选', tags:['50ml','到店试肤感'], reason:'日常会用防晒、想多比较一款精华乳质地时，可与清单里的 ROUND LAB 和 Beauty of Joseon 并排试。', giftAdvice:'防晒的肤感和成分偏好因人而异，更适合自己到店试过再买。', evidence:'选品线索：Olive Young韩国商品页与当前防晒榜单标签；不是小红书具体SKU实测。' },
  'beplain-mungbean-cleanser-kit': { name:'绿豆弱酸性洁面双支企划', category:'cleansing', skin:[], purposes:['self'], label:'日常洁面备选', tags:['160ml × 2','双支先算用量'], reason:'正在找日常洁面、而且确定会用完双支时再看；先和 ROUND LAB 独岛洁面比较泡沫感与洗后肤感。', giftAdvice:'洁面很挑肤感，不建议不了解对方习惯时送双支装。', evidence:'选品线索：Olive Young韩国商品页与洁面类目收录；不等于小红书实测或人人适用。' },
  'manyo-soybean-cleansing-oil-kit': { name:'纯大豆卸妆油双瓶企划', category:'cleansing', skin:[], purposes:['self'], label:'常化妆再囤', tags:['200ml × 2','带卸妆小样'], reason:'日常卸防晒或底妆、已有卸妆油习惯且会用完双瓶时考虑；可以和清单里的 Anua 卸妆油比较。', giftAdvice:'大容量卸妆油不适合盲送；更适合作为自己的常用款补货。', evidence:'选品线索：Olive Young韩国商品页与洁面/卸妆排行收录；不是功效证明或小红书实测。' },
  'mixsoon-bean-essence-kit': { name:'豆精华体验企划套装', category:'skincare', skin:[], purposes:['self'], label:'精华小样企划', tags:['50ml + 小样','先看完整成分'], reason:'本来就用精华、想比较不同质地时，可以先看带有小规格的企划；不要只按“豆”或“发酵”名称判断是否适合。', giftAdvice:'精华较挑成分与肤感，优先自用少量试，不建议盲送。', evidence:'选品线索：Olive Young韩国商品页列50ml精华、试用装与15ml面霜企划；不是小红书具体SKU实测。' },
  'medicube-pdrn-pink-ampoule-kit': { name:'PDRN 粉色安瓶补充装企划', category:'skincare', skin:[], purposes:['self'], label:'11月 Olive Young Pick', tags:['30ml + 50ml补充装','先核成分'], reason:'如果你明确想了解这类安瓶，可以在店里比较质地与成分；11月 Pick 只是官方企划线索，不代表功效得到验证。', giftAdvice:'活性护肤和补充装不适合初次试用或盲送；送之前确认对方的使用习惯。', evidence:'选品线索：Olive Young韩国官方商品页与2026年11月Pick企划；不作为医疗或功效承诺，也不是小红书实测。' },
  '3ce-blur-water-tint': { name:'Blur Water 柔雾唇釉', category:'makeup', skin:[], purposes:['self','gift'], label:'11月 Kuromi 企划', tags:['4.6g','多色先试色'], reason:'平时会用唇釉、喜欢柔雾唇妆或联名包装的人，可以到店试色后再挑。', giftAdvice:'更适合确认对方常用色系后送；Kuromi赠品与活动包装可能先售罄或因门店不同。', evidence:'选品线索：Olive Young韩国商品页及2026年11月企划；不等于小红书笔记推荐。' },
  'alternative-stereo-lip-potion': { name:'Lip Potion 焦糖釉光润唇膏', category:'makeup', skin:[], purposes:['self','gift'], label:'11月新品企划', tags:['3.1g','到店试色 / 质地'], reason:'想试一支小体积光泽唇膏、又能在店里比较颜色和触感时可以看看。', giftAdvice:'唇色和触感很个人；送给平时会用润唇膏且能确认色号偏好的人。', evidence:'选品线索：Olive Young韩国官方商品页及2026年11月Pick/新品标签；不是小红书实测。' },
  'torriden-dive-in-toner-kit': { name:'DIVE-IN 玻尿酸化妆水企划', category:'skincare', skin:['dry','oily'], purposes:['self'], label:'300 + 100ml 企划', tags:['化妆水','先看现有步骤'], reason:'已经会用化妆水、想补一款日常保湿的人；Torriden精华在清单里，先考虑自己是否需要重复步骤。', giftAdvice:'更适合自用；送护肤品前先确认对方的护理习惯与成分偏好。', evidence:'选品线索：Olive Young 韩国商品页及近期首页/品类排行收录；不是小红书实测。' },
  'unove-deep-damage-hair-mask-kit': { name:'Deep Damage Repair 发膜双瓶企划', category:'hairbody', skin:['hair'], purposes:['self'], label:'染烫发护理', tags:['320ml 双瓶','先试香味'], reason:'平时会用冲洗型发膜、发尾偏干或有染烫习惯时再考虑；双瓶装更适合确定会用完的人。', giftAdvice:'大容量且有香味，建议自用，不适合不了解对方习惯时盲送。', evidence:'选品线索：Olive Young 韩国商品页列320ml双瓶企划；库存与配送状态以门店为准。' },
  'menokin-quick-bubble-mask': { name:'30秒快速泡泡面膜', category:'masks', skin:[], purposes:['self'], label:'泡泡面膜体验款', tags:['6款选1','先确认使用说明'], reason:'想试试片状面膜以外的形式，可以先看这一款；先选适合自己的具体选项。', giftAdvice:'更适合自己先试；不熟悉对方肤质和护理偏好时不要盲送。', evidence:'选品线索：Olive Young 韩国商品页列6款选项及部分赠品组合；不引用宣传功效。' },
  'noprap-hydrogel-mask-kit': { name:'水凝胶面膜 5 + 1 片企划', category:'masks', skin:[], purposes:['self','gift'], label:'6款中选1', tags:['5 + 1 片','图示仅一款'], reason:'平时会敷面膜、想试水凝胶材质时可挑一款；六种并非混装，按自己的使用习惯选。', giftAdvice:'只送给确定会用面膜的人；先问清想要的类型，图片只展示六种中的一款。', evidence:'选品线索：Olive Young 韩国商品页当前列出6种选项和5 + 1片企划；页面起价不等于每个选项价格。' },
  'athe-butter-melting-lip-balm': { name:'Butter Melting Glow 润唇膏', category:'lips', skin:[], purposes:['self','gift'], label:'11月 Olive Young Pick', tags:['3.3g','多色 / 企划可选'], reason:'平时会用润唇膏、喜欢润泽光感时可以到店试试；联名包装和单品选项可能不同。', giftAdvice:'送礼先确认对方接受带色润唇膏及偏好的色号；礼盒和赠品以当期门店为准。', evidence:'选品线索：Olive Young 2026年11月Pick及商品页；不是小红书实测。' },
  'roundlab-birch': { name:'白桦树保湿防晒霜', category:'sunscreen', skin:['dry'], purposes:['self'], label:'日常防晒', tags:['偏保湿肤感','日常通勤'], reason:'把每天会用的防晒先选好；这套附一支旅行面霜。', giftAdvice:'防晒的肤感因人而异，更适合自己试用后再回购送人。' },
  'torriden-dive-in': { name:'DIVE-IN 玻尿酸精华', category:'skincare', skin:['dry','oily'], purposes:['self'], label:'基础保湿', tags:['补水步骤','基础护理'], reason:'想补一瓶日常保湿精华，可以先从这一瓶看起。', giftAdvice:'对方平时使用保湿精华时再考虑；不需要把护肤步骤越加越多。' },
  'aestura-atobarrier365': { name:'ATOBARRIER365 保湿面霜', category:'skincare', skin:['dry','sensitive'], purposes:['self'], label:'秋冬保湿', tags:['偏干肤质','先局部试用'], reason:'适合想加强秋冬保湿的人，先确认你喜欢这种滋润度。', giftAdvice:'更适合已知道对方偏干、用过同系列的情况。' },
  'laneige-lip-duo': { name:'莓果巧克力迷你唇膜', category:'lips', skin:['dry'], purposes:['self','gift'], label:'小份心意', tags:['两种香味','迷你套装'], reason:'莓果和巧克力两小罐，适合喜欢甜香的小礼物。', giftAdvice:'送给喜欢唇部护理、接受甜香的人；不是食品。' },
  'abib-heartleaf': { name:'鱼腥草贴合面膜', category:'masks', skin:['dry'], purposes:['self','gift'], label:'独立包装', tags:['5 + 1 片','轻巧伴手礼'], reason:'独立包装好携带，送给本来就爱敷面膜的朋友。', giftAdvice:'整套送更方便保留外包装与成分信息；初次使用先试一片。', noteId:'mask-comparison', image:'assets/abib-heartleaf-mask-packshot.webp', imageNote:'图示为套装中的单片；本页预算对应 5 + 1 片套装。' },
  'bringgreen-lip-stick': { name:'竹萃保湿润唇棒', category:'lips', skin:['dry'], purposes:['self','gift'], label:'万元内小礼', tags:['无色保湿款','随身携带'], reason:'不需要挑彩妆色号，适合放包里的一支实用小物。', giftAdvice:'选择标有 보습 的保湿款；先确认对方接受润唇类产品。' },
  'unove-tender-bloom': { name:'Tender Bloom 修护发膜', category:'hairbody', skin:['hair'], purposes:['self'], label:'照顾发尾', tags:['染烫 / 干燥发质','需冲洗'], reason:'发尾干燥、染烫后想增加柔顺感，可以先试质地和香味。', giftAdvice:'适合明确知道对方有护发习惯时送；细软发不一定喜欢厚重感。' },
  'illiyoon-ceramide': { name:'神经酰胺集中保湿霜', category:'hairbody', skin:['dry','sensitive'], purposes:['self'], label:'日常保湿', tags:['150ml 大支装','偏干肤质'], reason:'一大支日常保湿，适合比起小样更在意容量的人。', giftAdvice:'容量较大，优先自己用；送给熟悉且喜欢滋润型护理的人。' },
  'fillimilli-536': { name:'536 眼部晕染刷', category:'tools', skin:[], purposes:['self','gift'], label:'万元内小礼', tags:['无需选色号','适合化妆爱好者'], reason:'小号眼部晕染工具，适合会画眼影的朋友。', giftAdvice:'不涉及肤质和色号，但要确认对方平时画眼影。' },
  'mediheal-madecassoside': { name:'积雪草苷护理棉片', category:'masks', skin:['dry','oily'], purposes:['self'], label:'熟悉后再囤', tags:['100 + 100 片','小红书品牌线索'], reason:'喜欢棉片护理再考虑；大容量套装不建议初次就盲囤。', giftAdvice:'棉片比较占空间，也更挑使用习惯，优先自用。', noteId:'mediheal-note', image:'assets/mediheal-madecassoside-pads-clean.webp', imageNote:'图示为 100 片单罐；本页预算对应 100 + 100 片套装。' },
  'biodance-collagen': { name:'胶原凝胶面膜', category:'masks', skin:['dry'], purposes:['self','gift'], label:'护理爱好者', tags:['4 片装','凝胶质地'], reason:'给喜欢凝胶面膜的人换个选择，使用时长按包装来。', giftAdvice:'适合已经喜欢这类面膜的人；不把“胶原”当作效果保证。', image:'assets/biodance-collagen-option.webp', imageNote:'图示为粉色 Bio Collagen 单片；本页预算对应 4 片装。' },
  'dalba-peptide-duo': { name:'白松露肽精华喷雾', category:'skincare', skin:['dry'], purposes:['self','gift'], label:'了解偏好再送', tags:['100ml × 2','偏滋润肤感'], reason:'适合喜欢喷雾护理的人；双瓶装先确认香味偏好。', giftAdvice:'这份礼物更挑护肤习惯，适合已用过或明确想尝试的朋友。', budget:40000 },
  'romand-juicy-tint': { name:'果汁唇釉', category:'makeup', skin:[], purposes:['self','gift'], label:'先试色再送', tags:['3.5g','多色可选'], reason:'想挑一支日常唇妆，可以现场试色后再定色号。', giftAdvice:'送给平时会用唇釉的人；先确认常用色系，别只按包装图盲选。' },
  'dasique-mini-palette': { name:'Sanrio 联名迷你眼影盘', category:'makeup', skin:[], purposes:['self','gift'], label:'轻巧彩妆礼', tags:['迷你盘','多配色可选'], reason:'小盘便携，适合旅行补妆或喜欢角色联名的人。', giftAdvice:'先确认对方喜欢的冷暖色系和联名角色；页面不同盘色需单独挑选。' },
  'fwee-pudding-pot': { name:'唇颊两用柔雾布丁膏', category:'makeup', skin:[], purposes:['self','gift'], label:'同色唇颊', tags:['5g','唇颊两用'], reason:'想尝试唇颊同色妆，可以现场看颜色和质地。', giftAdvice:'颜色很挑人，适合愿意一起试色或已知对方偏好时送。' },
  'clio-kill-lash': { name:'Kill Lash 超持久睫毛膏', category:'makeup', skin:[], purposes:['self','gift'], label:'1 + 1 企划', tags:['两支装','防水型需卸妆'], reason:'平时会用睫毛膏、也能用完两支时再考虑囤这套。', giftAdvice:'仅适合确定对方用睫毛膏并喜欢该刷型时送；同时配合合适的眼唇卸妆。' },
  'laboh-scalp-shampoo': { name:'头皮强韧洗发水', category:'hairbody', skin:['hair'], purposes:['self'], label:'洗护自用', tags:['333 + 50ml','带旅行装'], reason:'想换洗发水时可先试，附带小瓶更适合短途携带。', giftAdvice:'洗发水和头皮感受因人而异，建议自用；不要把页面宣传理解为治疗保证。' },
  'ryo-damage-care-conditioner': { name:'黑润生气极损伤营养护发素', category:'hairbody', skin:['hair'], purposes:['self'], label:'冲洗型日常护发', tags:['480ml','先确认选项'], reason:'补上一支冲洗型护发素；结账前确认是红瓶护发素而非同页洗发水，先少量试用。', giftAdvice:'香味和滋润感比较个人，建议自用或先确认对方的护发习惯。', evidence:'Olive Young韩国官方多选项页面核对商品与480ml规格；页面起价不是所选护发素的确定售价。' },
  'drg-red-blemish-kit': { name:'清爽舒缓面霜套装', category:'skincare', skin:['oily','sensitive'], purposes:['self','gift'], label:'先比质地', tags:['70 + 30ml 面霜','加赠精华'], reason:'可在店里与偏厚润的面霜比较质地，确认自己喜欢再选。', giftAdvice:'护肤较挑肤质和成分习惯，只送给清楚了解对方日常护理的人。' },
  'wdressroom-hand-cream': { name:'10 周年香氛护手霜', category:'hairbody', skin:[], purposes:['self','gift'], label:'小份香氛礼', tags:['50ml','三款香型'], reason:'小支护手霜容易携带，三款香型可以先闻再选。', giftAdvice:'香味个人差异大；先试闻，香味敏感者不建议盲送。' },
  'anua-pdrn-mini-kit': { name:'PDRN 玻尿酸精华 + 面霜小套装', category:'skincare', skin:['dry'], purposes:['self','gift'], label:'小红书提及', tags:['30ml + 30ml','先试小规格'], reason:'公开小红书摘要提到这组精华和面霜；小规格适合先了解肤感。', giftAdvice:'不因笔记种草就送护肤品；确认成分偏好和使用习惯后再选。', noteId:'anua-note' },
  'mediheal-essential-mask-kit': { name:'Essential 精华面膜 10 + 1 片企划', category:'masks', skin:[], purposes:['self','gift'], label:'笔记提到品牌', tags:['7 种中选 1','11 片装'], reason:'公开笔记提到作者常买 MEDIHEAL 面膜；这款是官网另行核对的多片企划。', giftAdvice:'只送给平时会敷面膜的人；先确认想要的面膜类型，别把图片里多个款式当成一套。', noteId:'mediheal-note' },
  'cosrx-one-step-pad': { name:'One Step 棉片（4 款中选 1）', category:'masks', skin:['oily'], purposes:['self'], label:'酸类·先确认版本', tags:['100 片','不建议盲试'], reason:'公开笔记提到 COSRX 水杨酸棉片；官网当前商品页有4款选项，购买时核对具体版本和包装说明。', giftAdvice:'酸类产品不适合作为不了解对方习惯时的礼物；只给已在用且耐受的人考虑。', noteId:'cosrx-note' },
  'laneige-water-sleeping-mask-kit': { name:'Water Sleeping Mask 睡眠面膜企划', category:'skincare', skin:['dry'], purposes:['self','gift'], label:'夜间护理', tags:['70ml + 迷你装','企划款'], reason:'Olive Young 页面列有 70ml 正装与迷你装企划，适合本来就会用睡眠面膜的人。', giftAdvice:'先确认对方习惯用睡眠面膜、也不介意味道和肤感；这是编辑补充，不对应小红书笔记提到的其他兰芝款。' },
  'unove-silk-hair-oil-kit': { name:'丝柔护发精油双支企划', category:'hairbody', skin:['hair'], purposes:['self','gift'], label:'护发加一项', tags:['70ml 双支','先试香味'], reason:'补上免洗护发油选项；先试少量，确认香味与发尾质地。', giftAdvice:'适合明确有护发习惯的人；细软发和香味敏感者先试用再决定。' },
  'roundlab-dokdo-cleanser': { name:'1025 独岛低 pH 洁面', category:'cleansing', skin:['oily','sensitive'], purposes:['self'], label:'日常清洁', tags:['150ml','自己先试'], reason:'清单原先缺少洁面类别；这支方便现场核对规格、质地和洗后感受。', giftAdvice:'洁面也会因肤感和成分偏好不同，优先自己选，不建议盲送。' },
  'kosnori-whitening-dress-tone-up': { name:'Whitening Dress Tone-Up Cream 素颜霜', category:'makeup', skin:[], purposes:['self'], label:'素颜妆感 · 先试色', tags:['50ml','不能替代防晒'], reason:'想要轻底妆提亮效果时可以试；先在店里观察是否与肤色自然融合。', giftAdvice:'肤色和使用习惯都很个人，建议自用先试，不适合作为盲送礼物。' },
  'peripera-mood-glowy-tint': { name:'Mood Glowy 水润唇釉', category:'makeup', skin:[], purposes:['self','gift'], label:'先试色再送', tags:['4g','多色可选'], reason:'想找预算友好的水润唇妆，可以在店里试色后再定。', giftAdvice:'色号很多，送礼前确认对方常用色系；最好让对方自己试选。' },
  'innisfree-nosebum-ac-powder': { name:'No-Sebum AC 控油蜜粉', category:'makeup', skin:['oily'], purposes:['self'], label:'随身补妆', tags:['5g','偏油肌参考'], reason:'小规格定妆粉可补充油光护理选择；先少量上脸看看是否显干。', giftAdvice:'妆感与肤质比较个人，更适合自用后决定是否回购。' },
  'huxley-perfume-handcream': { name:'香氛护手霜（6 款任选 1）', category:'hairbody', skin:[], purposes:['self','gift'], label:'11 月 Olive Young Pick', tags:['香氛小礼','先试闻'], reason:'Olive Young 11 月企划页列出 6 款；先试闻香型，再挑一支日常用或送给明确喜欢香氛的人。', giftAdvice:'香味很挑人；Monchichi 包装、赠袋和活动内容都按所选款及当前门店实物确认。', evidence:'选品线索：Olive Young 2026 年 11 月 Pick 企划；不是小红书作者实测。' },
  'whipped-handbody-butter-bag': { name:'手部 / 身体护理迷你礼袋', category:'hairbody', skin:[], purposes:['self','gift'], label:'三款迷你礼袋', tags:['带手提袋','香型先确认'], reason:'Olive Young 商品页直接标注送礼推荐，三款小规格配手提袋；比大罐更适合分送或旅行携带。', giftAdvice:'仍是有香味与肤感偏好的身体护理品；先确认对方会用，也留意具体组合。', evidence:'选品线索：Olive Young 商品页的送礼推荐标记与礼袋包装；不是小红书笔记。' },
  'anua-heartleaf-cleansing-oil': { name:'鱼腥草毛孔护理卸妆油双瓶装', category:'cleansing', skin:[], purposes:['self'], label:'卸妆油双瓶', tags:['200ml × 2','官方销售榜收录'], reason:'给常用卸妆油的人补一个双瓶选择；先确认自己会用完，再决定要不要囤。', giftAdvice:'双瓶卸妆油更适合自用，卸妆习惯和肤感都不适合盲送。', evidence:'选品线索：Olive Young 韩国销售排行近期收录；排行会变化，不是功效证明或小红书实测。' },
  'beauty-of-joseon-rice-sunscreen-kit': { name:'米萃防晒霜加赠装', category:'sunscreen', skin:[], purposes:['self'], label:'防晒对比款', tags:['50ml + 20ml','企划会变化'], reason:'给日常防晒补一个不同品牌的比较项；在店里确认肤感，再和 ROUND LAB 款二选一。', giftAdvice:'防晒肤感与成分偏好因人而异，更建议自己试，不作为盲送礼物。', evidence:'选品线索：Olive Young 韩国销售排行近期收录；赠品、排名会变，不是小红书实测。' },
  'jungsaemool-skin-nuder-cushion': { name:'Essential Skin Nuder 气垫（正装 + 替换芯）', category:'makeup', skin:[], purposes:['self'], label:'底妆类目热销', tags:['正装 + 替换芯','先试色'], reason:'Olive Young 气垫类目热门款之一；只推荐给平时用气垫的人，现场试色后再决定。', giftAdvice:'底妆色号和妆感很挑人，不建议盲送；先在自然光下试色。', evidence:'选品线索：Olive Young 韩国气垫类目近期排行；不是小红书作者实测，也不代表适合所有肤质。' }
};
const productMap = new Map(research.products.map(p=>[p.id,p]));
const products = Object.entries(edits).map(([id, edit])=>{
  const p = productMap.get(id);
  const reference = p.price_reference;
  const checkedDate = reference?.accessed_date || p.listing_status?.checked_date;
  const dateLabel = checkedDate ? `${Number(checkedDate.slice(5,7))}月${Number(checkedDate.slice(8,10))}日` : '查询日';
  const referenceText = !reference
    ? `官方商品页已核对；没有可靠记录所选规格的页面价格，以店内标签为准（${dateLabel}）。`
    : reference.is_starting_price
      ? `${dateLabel}官方多选项页起价 ₩${reference.amount.toLocaleString('en-US')}，不等于本款最终价。`
      : `${dateLabel}官网页面参考价 ₩${reference.amount.toLocaleString('en-US')}；门店价格可能不同。`;
  const originalImage = basename(p.image_path);
  const optimizedImage = originalImage.replace(/\.(png|jpg)$/i,'.webp');
  const image = existsSync(new URL(`./dist/assets/${optimizedImage}`,import.meta.url))
    ? `assets/${optimizedImage}` : `assets/${originalImage}`;
  return {id,brand:p.brand,ko:p.name_ko,size:p.size,budget:p.budget_krw.amount,suitable:p.suitable,caution:p.caution,source:p.official_url,image,imageNote:p.image_note,checkedDate,priceNote:`${referenceText} 页面金额仅作购物预算参考。`,...edit};
});
const bundles = [
  {id:'small',for:'给会化妆的朋友',title:'轻巧的小心意',description:'一支无色润唇棒，加一支眼部晕染刷。用途简单，也不需要猜色号。',ids:['bringgreen-lip-stick','fillimilli-536']},
  {id:'care',for:'给爱做日常护理的朋友',title:'一份晚间护理',description:'甜香迷你唇膜搭配鱼腥草面膜，先确认对方的香味与护肤偏好。',ids:['laneige-lip-duo','abib-heartleaf']},
  {id:'familiar',for:'给熟悉护肤偏好的人',title:'多一点仪式感',description:'精华喷雾与凝胶面膜，适合已经喜欢滋润护理、愿意慢慢挑的人。',ids:['dalba-peptide-duo','biodance-collagen']},
  {id:'makeup',for:'给平时爱化妆的朋友',title:'一份上妆小礼',description:'果汁唇釉加迷你眼影盘。先确认常用色系，再到店试色；不是官方礼盒。',ids:['romand-juicy-tint','dasique-mini-palette']},
  {id:'night-care',for:'给常用面膜的人',title:'几天的夜间护理',description:'MEDIHEAL面膜与兰芝睡眠面膜搭配；只送给明确会用这类产品的人。不是官方礼盒，先核对具体款式和肤感。',ids:['mediheal-essential-mask-kit','laneige-water-sleeping-mask-kit']},
  {id:'small-care-gift',for:'给会用润唇膏的朋友',title:'手部与唇部小礼袋',description:'WHIPPED三款迷你护理霜加无色润唇棒；确认对方接受香味和身体护理品后再送。不是官方组合礼盒。',ids:['whipped-handbody-butter-bag','bringgreen-lip-stick']}
];
const picks = [
  {id:'abib-heartleaf',category:'面膜',note:'5＋1片鱼腥草款，先试一片；只送给平时会敷面膜的人。'},
  {id:'roundlab-birch',category:'防晒',note:'50ml防晒＋20ml面霜企划；先试肤感，面霜赠品不能替代防晒。'},
  {id:'hetras-mango-hand-cream',category:'护手霜',note:'50ml、8种香型任选；试闻后再决定，香味敏感时不盲送。'},
  {id:'aestura-atobarrier365',category:'面霜',note:'80ml保湿面霜；偏干可优先试，偏油肤质先看实际质地。'},
  {id:'kosnori-whitening-dress-tone-up',category:'素颜霜',note:'50ml轻底妆提亮；现场试色，看是否自然贴合肤色，不替代防晒。'},
  {id:'torriden-dive-in-toner-kit',category:'补水',note:'300ml＋100ml企划；已有保湿精华时按需取舍，不必两步都买。'},
  {id:'roundlab-dokdo-cleanser',category:'洁面',note:'150ml日常洁面；先确认洗后肤感，低pH定位不保证人人适用。'},
  {id:'torriden-dive-in',category:'精华',note:'50ml基础保湿精华；和化妆水用途有重合，按习惯选剂型即可。'},
  {id:'ryo-damage-care-conditioner',category:'护发素',note:'480ml冲洗型护发素；页面起价不是本选项单独售价，结账前确认选中护发素。'}
];
writeFileSync(new URL('./dist/data.js',import.meta.url),`// Generated from research.json and build-data.mjs.\nwindow.PRODUCTS = ${JSON.stringify(products,null,2)};\nwindow.BUNDLES = ${JSON.stringify(bundles,null,2)};\nwindow.PICKS = ${JSON.stringify(picks,null,2)};\n`);
console.log(`Generated ${products.length} products and ${bundles.length} gift bundles.`);
