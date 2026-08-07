/**
 * gen-data.ts — 生成模拟数据写入 SQLite
 * 用法：npx tsx scripts/gen-data.ts
 * 可重复执行（先清空旧数据）
 */
import { getDb, closeDb } from '../server/db/index'
import { createSchema } from '../server/db/schema'
import type { LangCode } from '../types'

type LText = Record<LangCode, string>

interface MockCategory {
  slug: string
  names: LText
  children: { slug: string; names: LText }[]
}

interface MockProduct {
  slug: string
  category: string // 父系列 slug
  price: number
  price_original: number
  cover: string
  title: LText
  description: LText
  specs: LText
}

/** 中文→其他语言的简易映射（占位演示，真实数据后续可人工替换） */
function t(zh: string, en: string, es: string, fr: string, ar: string): LText {
  return { zh, en, es, fr, ar }
}

const CATEGORIES: MockCategory[] = [
  {
    slug: 'rolex',
    names: t('劳力士', 'Rolex', 'Rolex', 'Rolex', 'رولكس'),
    children: [
      { slug: 'submariner', names: t('潜航者型', 'Submariner', 'Submariner', 'Submariner', 'سابمارينر') },
      { slug: 'daytona', names: t('迪通拿', 'Daytona', 'Daytona', 'Daytona', 'ديتونا') },
      { slug: 'datejust', names: t('日志型', 'Datejust', 'Datejust', 'Datejust', 'ديت جست') }
    ]
  },
  {
    slug: 'patek',
    names: t('百达翡丽', 'Patek Philippe', 'Patek Philippe', 'Patek Philippe', 'باتيك فيليب'),
    children: [
      { slug: 'nautilus', names: t('鹦鹉螺', 'Nautilus', 'Nautilus', 'Nautilus', 'نوتيلوس') },
      { slug: 'aquanaut', names: t('手雷', 'Aquanaut', 'Aquanaut', 'Aquanaut', 'أكوانوت') }
    ]
  },
  {
    slug: 'audemars',
    names: t('爱彼', 'Audemars Piguet', 'Audemars Piguet', 'Audemars Piguet', 'أوديمار بيغه'),
    children: [
      { slug: 'royaloak', names: t('皇家橡树', 'Royal Oak', 'Royal Oak', 'Royal Oak', 'رويال أوك') }
    ]
  },
  {
    slug: 'omega',
    names: t('欧米茄', 'Omega', 'Omega', 'Omega', 'أوميغا'),
    children: [
      { slug: 'speedmaster', names: t('超霸', 'Speedmaster', 'Speedmaster', 'Speedmaster', 'سبيد ماستر') }
    ]
  },
  {
    slug: 'richardmille',
    names: t('理查米尔', 'Richard Mille', 'Richard Mille', 'Richard Mille', 'ريتشارد ميل'),
    children: [
      { slug: 'rm35', names: t('RM35', 'RM35', 'RM35', 'RM35', 'RM35') }
    ]
  },
  {
    slug: 'cartier',
    names: t('卡地亚', 'Cartier', 'Cartier', 'Cartier', 'كارتييه'),
    children: [
      { slug: 'santos', names: t('山度士', 'Santos', 'Santos', 'Santos', 'سانتوس') }
    ]
  }
]

const PRODUCTS: MockProduct[] = [
  {
    slug: 'rolex-submariner-green',
    category: 'submariner',
    price: 399,
    price_original: 12500,
    cover: '/images/rolex-submariner.svg',
    title: t(
      '劳力士潜航者型 绿水鬼 116610LV 3135一体机芯',
      'Rolex Submariner Green 116610LV 3135 Movement',
      'Rolex Submariner Verde 116610LV Movimiento 3135',
      'Rolex Submariner Verte 116610LV Calibre 3135',
      'رولكس سابمارينر أخضر 116610LV حركة 3135'
    ),
    description: t(
      'VS厂巅峰之作，绿水鬼，原装开模，904L精钢，陶瓷圈口，配全套专柜包装。',
      'Top-tier replica of the Green Submariner, factory-grade 904L steel, ceramic bezel, full retail packaging.',
      'Réplica de primer nivel del Submariner verde, acero 904L, bisel de cerámica, embalaje completo.',
      'Réplique haut de gamme de la Submariner verte, acier 904L, lunette céramique, emballage complet.',
      'نسخة عالية الجودة من سابمارينر الخضراء، فولاذ 904L، إطار سيراميك، تغليف كامل.'
    ),
    specs: t(
      '{"机芯":"3135一体机芯","表径":"40mm","材质":"904L精钢","表镜":"蓝宝石","防水":"100米"}',
      '{"Movement":"3135 Calibre","Case":"40mm","Material":"904L Steel","Crystal":"Sapphire","Water":"100m"}',
      '{"Movimiento":"Calibre 3135","Caja":"40mm","Material":"Acero 904L","Cristal":"Zafiro","Agua":"100m"}',
      '{"Calibre":"3135","Boîtier":"40mm","Matériau":"Acier 904L","Verre":"Saphir","Eau":"100m"}',
      '{"الحركة":"3135","المقاس":"40مم","الخامة":"فولاذ 904L","الزجاج":"ياقوت","مقاومة الماء":"100م"}'
    )
  },
  {
    slug: 'rolex-daytona-panda',
    category: 'daytona',
    price: 449,
    price_original: 15800,
    cover: '/images/omega-speedmaster.svg',
    title: t(
      '劳力士迪通拿 熊猫盘 116500 4130一体机芯',
      'Rolex Daytona Panda 116500 4130 Movement',
      'Rolex Daytona Panda 116500 Movimiento 4130',
      'Rolex Daytona Panda 116500 Calibre 4130',
      'رولكس دايتونا باندا 116500 حركة 4130'
    ),
    description: t(
      'C厂顶级迪通拿，黑白熊猫盘，4130一体机芯，计时功能与专柜一致。',
      'Top-tier Daytona Panda, black/white dial, 4130 integrated movement, chronograph works like genuine.',
      'Daytona Panda de primera, esfera blanco/negro, movimiento integrado 4130.',
      'Daytona Panda haut de gamme, cadran noir/blanc, calibre intégré 4130.',
      'دايتونا باندا عالية الجودة، وجه أسود/أبيض، حركة مدمجة 4130.'
    ),
    specs: t(
      '{"机芯":"4130一体机芯","表径":"40mm","材质":"904L精钢","功能":"计时码表"}',
      '{"Movement":"4130","Case":"40mm","Material":"904L Steel","Function":"Chronograph"}',
      '{"Movimiento":"4130","Caja":"40mm","Material":"Acero 904L","Función":"Cronógrafo"}',
      '{"Calibre":"4130","Boîtier":"40mm","Matériau":"Acier 904L","Fonction":"Chronographe"}',
      '{"الحركة":"4130","المقاس":"40مم","الخامة":"فولاذ 904L","الوظيفة":"كرونوغراف"}'
    )
  },
  {
    slug: 'patek-nautilus-5711',
    category: 'nautilus',
    price: 499,
    price_original: 32000,
    cover: '/images/patek-nautilus.svg',
    title: t(
      '百达翡丽鹦鹉螺 5711/1A 蓝盘',
      'Patek Philippe Nautilus 5711/1A Blue Dial',
      'Patek Philippe Nautilus 5711/1A Esfera Azul',
      'Patek Philippe Nautilus 5711/1A Cadran Bleu',
      'باتيك فيليب نوتيلوس 5711/1A وجه أزرق'
    ),
    description: t(
      'PPF厂V4升级版，超薄钢王，一体化机芯，渐变蓝盘。',
      'PPF V4 upgraded, ultra-thin steel king, integrated movement, gradient blue dial.',
      'PPF V4 mejorado, rey del acero ultradelgado, movimiento integrado, esfera azul degradado.',
      'PPF V4 amélioré, roi de l\'acier ultra-mince, mouvement intégré, cadran bleu dégradé.',
      'إصدار PPF V4، ملك الفولاذ فائق النحافة، حركة مدمجة، وجه أزرق متدرج.'
    ),
    specs: t(
      '{"机芯":"324SC一体机芯","表径":"40mm","厚度":"8.3mm","表带":"一体钢带"}',
      '{"Movement":"324SC","Case":"40mm","Thickness":"8.3mm","Bracelet":"Integrated Steel"}',
      '{"Movimiento":"324SC","Caja":"40mm","Grosor":"8.3mm","Pulsera":"Acero integrado"}',
      '{"Calibre":"324SC","Boîtier":"40mm","Épaisseur":"8.3mm","Bracelet":"Acier intégré"}',
      '{"الحركة":"324SC","المقاس":"40مم","السماكة":"8.3مم","السوار":"فولاذ مدمج"}'
    )
  },
  {
    slug: 'ap-royal-oak-15500',
    category: 'royaloak',
    price: 469,
    price_original: 19000,
    cover: '/images/ap-royaloak.svg',
    title: t(
      '爱彼皇家橡树 15500 玫瑰金',
      'Audemars Piguet Royal Oak 15500 Rose Gold',
      'Audemars Piguet Royal Oak 15500 Oro Rosa',
      'Audemars Piguet Royal Oak 15500 Or Rose',
      'أوديمار بيغه رويال أوك 15500 ذهب وردي'
    ),
    description: t(
      'ZF厂皇牌大作，八角表圈，玫瑰金电镀，大格纹表盘。',
      'ZF masterpiece, octagonal bezel, rose gold plating, Grand Tapisserie dial.',
      'Obra maestra de ZF, bisel octogonal, oro rosa, esfera Tapisserie.',
      'Chef-d\'œuvre ZF, lunette octogonale, or rose, cadran Tapisserie.',
      'تحفة ZF، إطار مثمن، ذهب وردي، وجه نسيجي.'
    ),
    specs: t(
      '{"机芯":"4302一体机芯","表径":"41mm","表圈":"八角形","材质":"精钢镀玫瑰金"}',
      '{"Movement":"4302","Case":"41mm","Bezel":"Octagonal","Material":"Steel/Rose Gold"}',
      '{"Movimiento":"4302","Caja":"41mm","Bisel":"Octogonal","Material":"Acero/Oro"}',
      '{"Calibre":"4302","Boîtier":"41mm","Lunette":"Octogonale","Matériau":"Acier/Or"}',
      '{"الحركة":"4302","المقاس":"41مم","الإطار":"مثمن","الخامة":"فولاذ/ذهب"}'
    )
  },
  {
    slug: 'omega-speedmaster-moon',
    category: 'speedmaster',
    price: 349,
    price_original: 9200,
    cover: '/images/omega-speedmaster.svg',
    title: t(
      '欧米茄超霸 月球表 专业计时',
      'Omega Speedmaster Moonwatch Professional',
      'Omega Speedmaster Moonwatch Profesional',
      'Omega Speedmaster Moonwatch Professionnelle',
      'أوميغا سبيد ماستر موون ووتش'
    ),
    description: t(
      'OM厂经典月球表，三眼计时盘，测速刻度，硬汉必备。',
      'Classic Moonwatch, triple-register chronograph, tachymeter bezel.',
      'Moonwatch clásico, cronógrafo de tres subesferas.',
      'Moonwatch classique, chronographe triple compteur.',
      'كلاسيكية موون ووتش، كرونوغراف ثلاثي.'
    ),
    specs: t(
      '{"机芯":"计时机械机芯","表径":"42mm","表盘":"三眼","材质":"精钢"}',
      '{"Movement":"Chronograph","Case":"42mm","Dial":"Triple","Material":"Steel"}',
      '{"Movimiento":"Cronógrafo","Caja":"42mm","Esfera":"Triple","Material":"Acero"}',
      '{"Calibre":"Chrono","Boîtier":"42mm","Cadran":"Triple","Matériau":"Acier"}',
      '{"الحركة":"كرونوغراف","المقاس":"42مم","الوجه":"ثلاثي","الخامة":"فولاذ"}'
    )
  },
  {
    slug: 'richard-mille-rm35',
    category: 'rm35',
    price: 799,
    price_original: 98000,
    cover: '/images/richard-mille.svg',
    title: t(
      '理查米尔 RM35-02 拉斐尔纳达尔 碳纤维镂空',
      'Richard Mille RM35-02 Rafael Nadal Carbon Skeleton',
      'Richard Mille RM35-02 Rafael Nadal Carbono Esqueleto',
      'Richard Mille RM35-02 Rafael Nadal Carbone Squelette',
      'ريتشارد ميل RM35-02 كربون مكشوف'
    ),
    description: t(
      'KV厂碳纤维酒桶造型，全镂空机芯，轻若无物，霸气十足。',
      'KV carbon tonneau case, fully skeletonized movement, feather-light.',
      'Caja tonel de carbono, movimiento esqueletizado, ultraligero.',
      'Boîtier tonneau carbone, mouvement squeletté, ultra-léger.',
      'هيكل كربون، حركة مكشوفة، خفيف جداً.'
    ),
    specs: t(
      '{"机芯":"镂空自动机芯","表壳":"碳纤维","尺寸":"49.94x44.5mm","表镜":"蓝宝石"}',
      '{"Movement":"Skeleton Auto","Case":"Carbon","Size":"49.94x44.5mm","Crystal":"Sapphire"}',
      '{"Movimiento":"Auto Esqueleto","Caja":"Carbono","Tamaño":"49.94x44.5mm","Cristal":"Zafiro"}',
      '{"Calibre":"Auto Squelette","Boîtier":"Carbone","Taille":"49.94x44.5mm","Verre":"Saphir"}',
      '{"الحركة":"أوتوماتيك مكشوفة","الخامة":"كربون","المقاس":"49.94x44.5مم","الزجاج":"ياقوت"}'
    )
  },
  {
    slug: 'cartier-santos-medium',
    category: 'santos',
    price: 329,
    price_original: 8400,
    cover: '/images/cartier-santos.svg',
    title: t(
      '卡地亚山度士 中号 间金方形',
      'Cartier Santos Medium Two-Tone',
      'Cartier Santos Mediana Bicolor',
      'Cartier Santos Moyenne Bicolore',
      'كارتييه سانتوس وسط ذهبي'
    ),
    description: t(
      'V6厂经典方形表壳，罗马字面，蓝色宝石表冠，优雅永不过时。',
      'V6 classic square case, Roman numerals, blue sapphire crown.',
      'V6 caja cuadrada clásica, numerales romanos, corona zafiro azul.',
      'V6 boîtier carré classique, chiffres romains, couronne saphir bleu.',
      'V6 مربع كلاسيكي، أرقام رومانية، تاج ياقوت أزرق.'
    ),
    specs: t(
      '{"机芯":"9015自动机芯","表径":"35mm","表盘":"方形罗马字","材质":"精钢间金"}',
      '{"Movement":"9015 Auto","Case":"35mm","Dial":"Square Roman","Material":"Steel/Gold"}',
      '{"Movimiento":"9015 Auto","Caja":"35mm","Esfera":"Cuadrada","Material":"Acero/Oro"}',
      '{"Calibre":"9015 Auto","Boîtier":"35mm","Cadran":"Carré","Matériau":"Acier/Or"}',
      '{"الحركة":"9015 أوتو","المقاس":"35مم","الوجه":"مربع","الخامة":"فولاذ/ذهب"}'
    )
  }
]

/** 清空并重建数据 */
function seed(): void {
  const db = getDb()
  createSchema(db)

  // 清空旧数据（按外键顺序）
  db.exec('DELETE FROM product_media')
  db.exec('DELETE FROM products')
  db.exec('DELETE FROM categories')

  // 插入分类（品牌按 1000 间隔；系列在品牌区间内按 100 间隔）
  const insCat = db.prepare(
    `INSERT INTO categories (parent_id, slug, sort, name_en, name_es, name_fr, name_ar, name_zh)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const childIds: Record<string, number> = {}

  CATEGORIES.forEach((brand, bi) => {
    const brandSort = 1000 + bi * 1000
    const info = insCat.run(
      null,
      brand.slug,
      brandSort,
      brand.names.en, brand.names.es, brand.names.fr, brand.names.ar, brand.names.zh
    )
    const brandId = Number(info.lastInsertRowid)

    brand.children.forEach((series, si) => {
      const childInfo = insCat.run(
        brandId,
        series.slug,
        brandSort + 100 + si * 100,
        series.names.en, series.names.es, series.names.fr, series.names.ar, series.names.zh
      )
      childIds[series.slug] = Number(childInfo.lastInsertRowid)
    })
  })

  // 插入产品
  const insProduct = db.prepare(
    `INSERT INTO products (
      category_id, slug, sort, price, price_original, cover,
      title_en, title_es, title_fr, title_ar, title_zh,
      description_en, description_es, description_fr, description_ar, description_zh,
      specs_en, specs_es, specs_fr, specs_ar, specs_zh
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )

  const insMedia = db.prepare(
    'INSERT INTO product_media (product_id, type, url, sort) VALUES (?, ?, ?, ?)'
  )

  // 每个系列内的产品排序计数（sort 按 1000 起步，100 间隔）
  const seriesSortCounter: Record<string, number> = {}

  for (const p of PRODUCTS) {
    const catId = childIds[p.category]
    if (!catId) {
      console.warn(`跳过产品 ${p.slug}：分类 ${p.category} 不存在`)
      continue
    }

    if (!(p.category in seriesSortCounter)) {
      seriesSortCounter[p.category] = 1000
    }
    const pSort = seriesSortCounter[p.category]
    seriesSortCounter[p.category] += 100

    const info = insProduct.run(
      catId, p.slug, pSort, p.price, p.price_original, p.cover,
      p.title.en, p.title.es, p.title.fr, p.title.ar, p.title.zh,
      p.description.en, p.description.es, p.description.fr, p.description.ar, p.description.zh,
      p.specs.en, p.specs.es, p.specs.fr, p.specs.ar, p.specs.zh
    )
    const pid = Number(info.lastInsertRowid)

    // 图集：主图 + 细节图（此处用同一张占位，后续可替换真实图）
    insMedia.run(pid, 'image', p.cover, 0)
    insMedia.run(pid, 'image', p.cover, 1)
  }

  console.log(`✅ 分类: ${db.prepare('SELECT COUNT(*) as n FROM categories').get().n}`)
  console.log(`✅ 产品: ${db.prepare('SELECT COUNT(*) as n FROM products').get().n}`)
  console.log(`✅ 图集: ${db.prepare('SELECT COUNT(*) as n FROM product_media').get().n}`)
}

seed()
closeDb()
