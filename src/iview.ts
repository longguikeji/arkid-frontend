import Affix from 'iview/src/components/affix';
import Alert from 'iview/src/components/alert';
import Anchor from 'iview/src/components/anchor';
import AnchorLink from 'iview/src/components/anchor-link';
import AutoComplete from 'iview/src/components/auto-complete';
import Avatar from 'iview/src/components/avatar';
import BackTop from 'iview/src/components/back-top';
import Badge from 'iview/src/components/badge';
import Breadcrumb from 'iview/src/components/breadcrumb';
import Button from 'iview/src/components/button';
import Card from 'iview/src/components/card';
import Carousel from 'iview/src/components/carousel';
import Cascader from 'iview/src/components/cascader';
import Cell from 'iview/src/components/cell';
import Checkbox from 'iview/src/components/checkbox';
import Circle from 'iview/src/components/circle';
import Collapse from 'iview/src/components/collapse';
import ColorPicker from 'iview/src/components/color-picker';
import Content from 'iview/src/components/content';
import DatePicker from 'iview/src/components/date-picker';
import Divider from 'iview/src/components/divider';
import Drawer from 'iview/src/components/drawer';
import Dropdown from 'iview/src/components/dropdown';
import Footer from 'iview/src/components/footer';
import Form from 'iview/src/components/form';
import Header from 'iview/src/components/header';
import Icon from 'iview/src/components/icon';
import Input from 'iview/src/components/input';
import InputNumber from 'iview/src/components/input-number';
import Scroll from 'iview/src/components/scroll';
import Split from 'iview/src/components/split';
import Layout from 'iview/src/components/layout';
import LoadingBar from 'iview/src/components/loading-bar';
import Menu from 'iview/src/components/menu';
import Message from 'iview/src/components/message';
import Modal from 'iview/src/components/modal';
import Notice from 'iview/src/components/notice';
import Page from 'iview/src/components/page';
import Poptip from 'iview/src/components/poptip';
import Progress from 'iview/src/components/progress';
import Radio from 'iview/src/components/radio';
import Rate from 'iview/src/components/rate';
import Sider from 'iview/src/components/sider';
import Slider from 'iview/src/components/slider';
import Spin from 'iview/src/components/spin';
import Steps from 'iview/src/components/steps';
import Switch from 'iview/src/components/switch';
import Table from 'iview/src/components/table';
import Tabs from 'iview/src/components/tabs';
import Tree from 'iview/src/components/tree';
import Tag from 'iview/src/components/tag';
import Time from 'iview/src/components/time';
import Timeline from 'iview/src/components/timeline';
import TimePicker from 'iview/src/components/time-picker';
import Tooltip from 'iview/src/components/tooltip';
import Transfer from 'iview/src/components/transfer';
import Upload from 'iview/src/components/upload';
import Row from 'iview/src/components/grid/row';
import Col from 'iview/src/components/grid/col';
import Select from 'iview/src/components/select/select';
import Option from 'iview/src/components/select/option';
import OptionGroup from 'iview/src/components/select/option-group';

import LinkMixin from 'iview/src/mixins/link';


const components = {
  Affix,
  Alert,
  Anchor,
  AnchorLink,
  AutoComplete,
  Avatar,
  BackTop,
  Badge,
  Breadcrumb,
  BreadcrumbItem: Breadcrumb.Item,
  Button,
  ButtonGroup: Button.Group,
  Card,
  Carousel,
  CarouselItem: Carousel.Item,
  Cascader,
  Cell,
  CellGroup: Cell.Group,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Col,
  Collapse,
  ColorPicker,
  Content,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  DropdownItem: Dropdown.Item,
  DropdownMenu: Dropdown.Menu,
  Footer: Footer,
  Form,
  FormItem: Form.Item,
  Header: Header,
  Icon,
  Input,
  InputNumber,
  Scroll,
  Sider: Sider,
  Split,
  Submenu: Menu.Sub,
  Layout: Layout,
  LoadingBar,
  Menu,
  MenuGroup: Menu.Group,
  MenuItem: Menu.Item,
  Message,
  Modal,
  Notice,
  Option,
  OptionGroup,
  Page,
  Panel: Collapse.Panel,
  Poptip,
  Progress,
  Radio,
  RadioGroup: Radio.Group,
  Rate,
  Row,
  Select,
  Slider,
  Spin,
  Step: Steps.Step,
  Steps,
  Table,
  Tabs,
  TabPane: Tabs.Pane,
  Tree,
  Tag,
  Time,
  Timeline,
  TimelineItem: Timeline.Item,
  TimePicker,
  Tooltip,
  Transfer,
  Upload,
  //Circle,
  //Switch,
};


export default {
  install(Vue) {
    // 让 :to= object 的情况 也显示 href
    (function(link) {
      link.computed.linkUrl = function() {
        const type = typeof this.to;
        const buildHref = () => {
          const ref = this.$router.resolve(this.to, this.$route, false);
          return ref.href;
        };

        return type === 'string' ? this.to : buildHref();
      };
    })(LinkMixin);

    Card.props.disHover.default = true;

    // iview 的组件依赖这个, 先保留
    Vue.prototype.$IVIEW = {
      size: '',
      transfer: '',
      select: '',
      modal: '',
      tree: '',
      menu: {},
    };

    Vue.prototype.$Loading = components.LoadingBar;
    Vue.prototype.$Message = components.Message;
    Vue.prototype.$Modal = components.Modal;
    Vue.prototype.$Notice = components.Notice;
    Vue.prototype.$Spin = components.Spin;

    Object.keys(components).forEach(key => {
        Vue.component(key, components[key]);
    });
  },
};
