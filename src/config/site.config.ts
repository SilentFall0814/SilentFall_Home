/**
 * ============================================================
 *  SilentFall 个人主页 —— 全站文字内容配置文件
 * ============================================================
 *
 *  想修改网站上的任何文字？只需修改这个文件即可。
 *  所有页面、组件的文字内容都从这里读取。
 *
 *  修改后保存，页面会自动热更新刷新。
 * ============================================================
 */

// ----------------------------------------------------------
//  站点基础信息
// ----------------------------------------------------------
export const SITE = {
  /** 站点名称 / 品牌名（显示在导航栏和页脚） */
  name: "SilentFall",
  /** 页脚品牌描述 */
  footerTagline: "一个试图把奇怪想法变成软件的人类。",
  /** 页脚版权小字 */
  footerCopyright: "用热爱和咖啡因驱动",
  /** Contact 底部签名 */
  contactSignature: "Made with care by SilentFall",
} as const;

// ----------------------------------------------------------
//  导航栏链接
// ----------------------------------------------------------
export const NAV_LINKS = [
  { label: "关于", href: "#about" },
  { label: "此刻", href: "#now" },
  { label: "技能", href: "#skills" },
  { label: "作品", href: "#projects" },
  { label: "装备", href: "#uses" },
  { label: "联系", href: "#contact" },
] as const;

// ----------------------------------------------------------
//  Hero 首屏区域
// ----------------------------------------------------------
export const HERO = {
  /** 顶部欢迎语（明色版） */
  welcomeText: "欢迎来到我的个人主页",
  /** 顶部欢迎语（暗色覆盖层版） */
  welcomeTextDark: "WELCOME TO MY HOMEPAGE",
  /** 大标题 "HELLO,I'M"（明色版） */
  greeting: "HELLO,I'M",
  /** 大标题 "HELLO, I'M"（暗色覆盖层版） */
  greetingDark: "HELLO, I'M",
  /** 签名名称（显示在 SignatureLetters 中） */
  signatureName: "SilentFall",
  /** 副标题信息项（明色版，用分隔符隔开显示） */
  subtitleItems: ["SilentFall", "14岁", "中国·北京"],
  /** 副标题信息（暗色覆盖层版，单行显示） */
  subtitleDark: "SilentFall | 14 | Beijing, China",
  /** 底部提示文字 */
  exploreHint: "移动鼠标探索",
} as const;

// ----------------------------------------------------------
//  关于 (About) 区域
// ----------------------------------------------------------
export const ABOUT = {
  /** 板块标题配置 */
  heading: {
    eyebrow: "关于",
    title: "你好！我是SilentFall",
    description: "我是一名学生，一个试图把脑子里的奇怪想法变成软件的人。",
  },
  /** 主卡片小标题 */
  cardLabel: "关于我",
  /** 主卡片大标题 */
  cardTitle: "一个社恐、宅男、一个有着非常非常多的奇怪想法的人类",
  /** 主卡片正文段落 */
  cardParagraphs: [
    "平时喜欢待在电脑前折腾点东西，有时候是写点小程序，有时候只是单纯地把桌面整理得更顺眼一点。",
    "我对「为什么会这样」这种问题有点执念，比如会突然想做一个网页来介绍自己，然后就真的来做了个网页。",
  ],
  /** 标签区小标题 */
  tagsLabel: "我的一些标签",
  /** 个人标签 */
  tags: ["宅男", "社恐", "抽象", "伪人", "夜猫子", "细节控", "想法很多", "行动力随机"],
  /** 时间线小标题 */
  timelineLabel: "时间线",
  /** 时间线节点 */
  timeline: [
    {
      year: "现在",
      title: "学生 & 独立开发者",
      description: "在学习和折腾之间反复横跳，试图把脑子里的想法变成真正的软件。",
    },
    {
      year: "某天",
      title: "开始写代码",
      description: "第一次让屏幕上出现「Hello World」的时候，觉得这东西有点意思。",
    },
    {
      year: "更早",
      title: "对电脑产生好奇",
      description: "从拆家里的旧电脑开始，虽然装回去的时候多了几颗螺丝。",
    },
  ],
  /** 右侧特性卡片 */
  points: [
    {
      title: "日常罢了",
      description:
        "除了这些，我也会刷视频、听音乐、偶尔发呆，和大多数人差不多，因为我真的很闲。",
    },
    {
      title: "宅男",
      description:
        "一天里大部分时间都在电脑前，但也会偶尔站起来走走，假装自己很健康。",
    },
    {
      title: "人类？？？",
      description: "有时候会盯着一个界面发呆，然后才意识到已经过去好几分钟。",
    },
  ],
} as const;

// ----------------------------------------------------------
//  此刻 (Now) 区域
// ----------------------------------------------------------
export const NOW = {
  heading: {
    eyebrow: "此刻",
    title: "我最近在做什么",
    description:
      "灵感来自 nownownow.com —— 一个记录当下状态的页面。最后更新：2026 年 6 月。",
  },
  /** 底部注释 */
  footnote: "这个页面会不定期更新，记录我当下的状态。",
  /** 此刻在做的事 */
  items: [
    {
      icon: "code",
      title: "正在折腾",
      description: "把这个个人主页改了又改，试图让它看起来更像个正经人做的。",
      tag: "进行中",
    },
    {
      icon: "book",
      title: "正在学习",
      description: "React、TypeScript，还有那些前端世界里永远学不完的新东西。",
      tag: "持续中",
    },
    {
      icon: "music",
      title: "正在听",
      description: "写代码的时候总得有点背景音，最近循环的是一些没有歌词的纯音乐。",
      tag: "日常",
    },
    {
      icon: "think",
      title: "正在想",
      description: "为什么 14 岁的我要花这么多时间在屏幕前？算了，先把这个功能写完再说。",
      tag: "永恒",
    },
  ],
} as const;

// ----------------------------------------------------------
//  技能 (Skills) 区域
// ----------------------------------------------------------
export const SKILLS = {
  heading: {
    eyebrow: "技能",
    title: "我会些什么",
    description:
      "说实话，大部分技能都停留在「能用」的阶段，但这不妨碍我继续折腾。",
  },
  /**
   * 技能分组
   * tone 字段控制标签配色（与 level 文字解耦）：
   *   clay / clay-strong / sage / slate / ink
   * 修改 level 的文字不会影响样式，只需保持 tone 不变即可
   */
  groups: [
    {
      category: "编程语言",
      items: [
        { name: "TypeScript", level: "熟悉", tone: "clay" },
        { name: "JavaScript", level: "熟悉", tone: "clay" },
        { name: "Python", level: "能用", tone: "sage" },
        { name: "HTML / CSS", level: "熟悉", tone: "clay" },
      ],
    },
    {
      category: "框架 & 工具",
      items: [
        { name: "React", level: "熟悉", tone: "clay" },
        { name: "Vite", level: "熟悉", tone: "clay" },
        { name: "Tailwind CSS", level: "熟悉", tone: "clay" },
        { name: "Git", level: "能用", tone: "sage" },
      ],
    },
    {
      category: "设计 & 其他",
      items: [
        { name: "Figma", level: "摸索中", tone: "slate" },
        { name: "VS Code", level: "重度依赖", tone: "clay" },
        { name: "Linux", level: "好奇中", tone: "ink" },
        { name: "折腾", level: "满级", tone: "clay-strong" },
      ],
    },
  ],
} as const;

// ----------------------------------------------------------
//  作品 (Projects) 区域
// ----------------------------------------------------------
export const PROJECTS = {
  heading: {
    eyebrow: "作品",
    title: "我做过什么",
    description:
      "数量不多，但每一个都是认真折腾过的。有些还在改，有些改不动了。",
  },
  /**
   * 项目列表
   * tone 字段控制状态标签配色（与 status 文字解耦）：
   *   clay / sage / mid
   * 修改 status 的文字不会影响样式，只需保持 tone 不变即可
   */
  items: [
    {
      id: "homepage",
      title: "个人主页",
      description:
        "就是你现在看到的这个。从零开始搭建，改了无数版，每一版都觉得上一版不行。",
      tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
      status: "持续迭代",
      tone: "clay",
      href: "#",
    },
    {
      id: "blog",
      title: "个人博客",
      description:
        "偶尔写点东西的地方，内容涵盖技术笔记、胡思乱想和一些没什么用的发现。",
      tags: ["博客", "写作"],
      status: "运营中",
      tone: "sage",
      href: "http://blog.ljb666.xyz/",
    },
    {
      id: "more",
      title: "更多作品",
      description:
        "还有一些乱七八糟的小项目散落在各个角落，等我觉得它们能见人了再放上来。",
      tags: ["敬请期待"],
      status: "酝酿中",
      tone: "mid",
      href: "https://github.com/SilentFall0814",
    },
  ],
} as const;

// ----------------------------------------------------------
//  装备 (Uses) 区域
// ----------------------------------------------------------
export const USES = {
  heading: {
    eyebrow: "装备",
    title: "我用什么",
    description:
      "不是什么专业测评，就是记录一下每天陪伴我的工具们。",
  },
  /** 硬件区小标题 */
  hardwareLabel: "硬件",
  /** 软件区小标题 */
  softwareLabel: "软件",
  /** 硬件列表 */
  hardware: [
    {
      name: "一台电脑",
      description: "写代码、看视频、发呆，全靠它。具体配置不重要，能跑就行。",
    },
    {
      name: "一副耳机",
      description: "隔绝外界噪音的物理外挂，戴上它世界就安静了。",
    },
    {
      name: "一个杯子",
      description: "永远装着水或者别的什么液体，是熬夜的必备燃料补给站。",
    },
  ],
  /** 软件列表 */
  software: [
    { name: "VS Code", description: "每天打开时间最长的软件，没有之一。" },
    { name: "Chrome", description: "查 bug 和摸鱼的主力浏览器。" },
    { name: "Git", description: "版本控制，让我有勇气随便改代码。" },
    { name: "Figma", description: "画原型和配色，虽然经常画完又推翻。" },
    { name: "Vite", description: "快得离谱的构建工具，等编译的时间够喝口水。" },
    { name: "Obsidian", description: "记笔记和乱七八糟的想法，第二大脑。" },
  ],
} as const;

// ----------------------------------------------------------
//  找到我 (Other Pages) 区域
// ----------------------------------------------------------
export const OTHER_PAGES_HEADING = {
  eyebrow: "找到我",
  title: "在这些地方也能找到我",
  description: "如果你想看更多我的动态，欢迎来这些平台逛逛。",
} as const;

// ----------------------------------------------------------
//  社交链接（用于 Other Pages 和 Footer）
//  icon 字段为图标标识符，组件内根据标识符渲染对应 SVG
// ----------------------------------------------------------
export const SOCIAL_LINKS = [
  {
    id: "github",
    title: "GitHub",
    icon: "github" as const,
    href: "https://github.com/SilentFall0814",
  },
  {
    id: "blog",
    title: "个人博客",
    icon: "blog" as const,
    href: "http://blog.ljb666.xyz/",
  },
  {
    id: "bilibili",
    title: "哔哩哔哩",
    icon: "bilibili" as const,
    href: "https://space.bilibili.com/3493079350774423",
  },
  {
    id: "douyin",
    title: "抖音",
    icon: "douyin" as const,
    href: "https://www.douyin.com/user/MS4wLjABAAAA7aQIXbw_TC2NVqsX2amf0oxu7f5J-sTd9cu4_QGK-D9KTGJyPfYZDYBwHHYTpET_?from_tab_name=main",
  },
] as const;

// ----------------------------------------------------------
//  联系 (Contact) 区域
// ----------------------------------------------------------
export const CONTACT = {
  heading: {
    eyebrow: "联系我",
    title: "这里是主包的邮箱地址哦！",
    description: "你有什么想和我单独说的呢？欢迎投稿！",
  },
  /** 复制按钮文字 */
  copyButton: "复制邮箱地址",
  copiedButton: "已复制邮箱",
  /** 联系方式列表 */
  items: [
    {
      label: "163网易邮箱",
      value: "LJB110814@163.com",
      description: "你有什么想和我单独说的呢？欢迎投稿！",
      href: "mailto:LJB110814@163.com",
    },
    {
      label: "QQ邮箱",
      value: "liangjunboljb@qq.com",
      description: "163网易邮箱未及时回复时可发这里",
      href: "mailto:liangjunboljb@qq.com",
    },
  ],
} as const;
