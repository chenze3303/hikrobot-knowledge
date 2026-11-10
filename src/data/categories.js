/**
 * 栏目配置
 * group: 侧边栏分组；icon: Icon.vue 中的图标名
 */
export const groups = [
  {
    id: 'product',
    index: '01',
    label: '产品与方案',
    description: '读码器选型与系列差异',
    categories: ['selection']
  },
  {
    id: 'deploy',
    index: '02',
    label: '部署与调试',
    description: '安装、光学、软件与参数',
    categories: ['installation', 'software']
  },
  {
    id: 'integration',
    index: '03',
    label: '系统集成',
    description: '通讯协议与二次开发',
    categories: ['communication', 'development']
  },
  {
    id: 'support',
    index: '04',
    label: '运维与支持',
    description: '排障、保养、视频与下载',
    categories: ['troubleshooting', 'maintenance', 'videos']
  }
]

export const categories = [
  {
    id: 'selection',
    title: '产品与选型',
    short: '选型',
    icon: 'layers',
    group: 'product',
    tagline: '选对型号，比调参更重要',
    description: '从读码类型、工作距离、视野、节拍到产品系列，快速锁定适合的固定式读码器、手持巴枪或 PDA。',
    keywords: ['ID2000', 'ID3000', 'ID5000', 'IDH', 'IDP', '选型']
  },
  {
    id: 'installation',
    title: '安装与光学',
    short: '安装',
    icon: 'target',
    group: 'deploy',
    tagline: '成像质量决定读码上限',
    description: '安装角度、工作距离、镜头、光源与 I/O 接线，先把图像和触发做对，再谈算法参数。',
    keywords: ['安装', '工作距离', '镜头', '光源', '触发', '接线']
  },
  {
    id: 'software',
    title: '调试与软件',
    short: '调试',
    icon: 'sliders',
    group: 'deploy',
    tagline: 'IDMVS 从连通到稳定读码',
    description: 'IDMVS 客户端、曝光增益、码制参数、TCP 触发、FTP 输出与固件升级的实操步骤。',
    keywords: ['IDMVS', '曝光', '增益', '触发', '固件', 'FTP']
  },
  {
    id: 'communication',
    title: '通讯与协议',
    short: '通讯',
    icon: 'network',
    group: 'integration',
    tagline: '让读码结果稳定送达',
    description: 'Profinet、EtherNet/IP、MC & SLMP、Modbus TCP、Fins 等 PLC 通讯的组态与排查。',
    keywords: ['TCP', '串口', 'PLC', 'Profinet', 'EtherNet/IP', 'Modbus', 'Fins', 'MC']
  },
  {
    id: 'development',
    title: '二次开发',
    short: '开发',
    icon: 'code',
    group: 'integration',
    tagline: '把读码能力写进业务系统',
    description: '用 SDK 自定义触发、取流、结果回调与图像保存，把读码能力嵌进 MES、WMS 或自有上位机。',
    keywords: ['SDK', '二次开发', 'API', '取流', '回调', '集成']
  },
  {
    id: 'troubleshooting',
    title: '故障排查',
    short: '排障',
    icon: 'alert',
    group: 'support',
    tagline: '从现象倒推到根因',
    description: '读不到、误读、漏读、重复读、网络不通、图像发糊，按现象拆解排查顺序。',
    keywords: ['读不到', '误读', '漏读', '网络', '图像', '排障']
  },
  {
    id: 'maintenance',
    title: '维护与资源',
    short: '维护',
    icon: 'shield',
    group: 'support',
    tagline: '把设备寿命和资料一起管好',
    description: '日常清洁、镜头保养、固件与文档下载、保修维修流程，以及读码器常用术语。',
    keywords: ['清洁', '保养', '固件', '下载', '保修', '术语']
  },
  {
    id: 'videos',
    title: '视频教程',
    short: '视频',
    icon: 'play',
    group: 'support',
    tagline: '看得见的操作步骤',
    description: '按设备与场景组织的短视频演示：连接、调参、触发、通讯与排障，点击封面即可在新标签页观看。',
    keywords: ['视频', '演示', '操作', 'IDMVS', '接线']
  }
]

export const categoryMap = Object.fromEntries(categories.map((item) => [item.id, item]))

export const hotSearches = ['触发方式', '读不到码', 'TCP 通讯', 'SDK', 'IDMVS', 'DPM', '工作距离']
