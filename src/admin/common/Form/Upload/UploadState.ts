import { BaseState } from '@/admin/base/BaseVue'

export default interface UploadState extends BaseState {
  action?: string; //必选参数，上传的地址
  headers: object; // 设置上传的请求头部
  multiple: boolean; // 是否支持多选文件
  data: object; // 上传时附带的额外参数
  name: string; // 上传的文件字段名 string
  withCredentials: boolean; // 支持发送 cookie 凭证信息 boolean — false
  showFileList: boolean; //是否显示已上传文件列表 true
  drag: boolean; // 是否启用拖拽上传 boolean — false
  accept: string; // 接受上传的文件类型（thumbnail-mode 模式下此参数无效） string — —
  onPreview: Function; //点击文件列表中已上传的文件时的钩子
  onRemove: Function; //文件列表移除文件时的钩子 function(file, fileList) — —
  onSuccess: Function; // 文件上传成功时的钩子 function(response, file, fileList) — —
  onError: Function; // 文件上传失败时的钩子 function(err, file, fileList) — —
  onProgress: Function; // 文件上传时的钩子 function(event, file, fileList) — —
  onChange: Function; // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 function(file, fileList) — —
  beforeUpload: Function; // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。 function(file) — —
  beforeRemove: Function; // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。 function(file, fileList) — —
  listType: string; // 文件列表的类型 string text/picture/picture-card text
  autoUpload: boolean; // 是否在选取文件后立即进行上传 boolean — true
  fileList: Array<any>; // 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] array — []
  httpRequest: Function; // 覆盖默认的上传行为，可以自定义上传的实现 function — —
  disabled: boolean; // 是否禁用 boolean — false
  limit: number; // 最大允许上传个数 number — —
  onExceed: Function; // 文件超出个数限制时的钩子 function(files, fileList) —

  value: string;
  type: string; //区分uploadFile  uploadImage  uploadXslFile
  title: string; //Dialog 的标题
  crops: Array<any>; //图片参数
  keyName: string;

  img: any; //裁剪图片的地址 空 url 地址 || base64 || blob
  outputSize: number; // 裁剪生成图片的质量 1 0.1 - 1
  outputType: string; // 裁剪生成图片的格式 jpg (jpg 需要传入jpeg) jpeg || png || webp
  info: boolean; // 裁剪框的大小信息 true true || false
  canScale: boolean; // 图片是否允许滚轮缩放 true true || false
  autoCrop: boolean; //是否默认生成截图框 false true || false
  fixed: boolean; //是否开启截图框宽高固定比例 true true | false
  fixedNumber: string; // 截图框的宽高比例 [1, 1] [宽度, 高度]
  full: boolean; // 是否输出原图比例的截图 false true | false
  fixedBox: boolean; // 固定截图框大小 不允许改变 false true | false
  canMove: boolean; // 上传图片是否可以移动 true true | false
  canMoveBox: boolean; // 截图框能否拖动 true true | false
  original: boolean; // 上传图片按照原始比例渲染 false true | false
  centerBox: boolean; //截图框是否被限制在图片里面 false true | false
  high: boolean; // 是否按照设备的dpr 输出等比例图片 true true | false
  infoTrue: boolean; // true 为展示真实输出图片宽高 false 展示看到的截图框宽高 false true | false
  maxImgSize: number; // 限制图片最大宽度和高度 2000 0-max
  enlarge: number; // 图片根据截图框输出比例倍数 1 0-max(建议不要太大不然会卡死的呢)
  mode: string; // 图片默认渲染方式 contain contain , cover, 100px, 100% auto
}
