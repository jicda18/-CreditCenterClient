import { NavItem } from '../models/nav-item.model';
import { translate } from './helpers.utils';

export const languagePrimeNg = {
  startsWith: 'Inicia con',
  notStartsWith: 'No inicia con',
  contains: 'Contiene',
  notContains: 'No contiene',
  endsWith: 'Termina con',
  notEndsWith: 'No termina con',
  equals: 'Igual',
  notEquals: 'Diferente',
  noFilter: 'No filtro',
  lt: 'Menor que',
  lte: 'Menor o igual que',
  gt: 'Mayor que',
  gte: 'Mayor o igual que',
  is: 'Es',
  isNot: 'No es',
  before: 'Antes',
  after: 'Después',
  between: 'Entre',
  clear: 'Limpiar',
  apply: 'Aplicar',
  matchAll: 'Coincidir con todos',
  matchAny: 'Coincidir con algunos',
  addRule: 'Agregar Regla',
  removeRule: 'Remover Regla',
  accept: 'Si',
  reject: 'No',
  choose: 'Escoger',
  upload: 'Subir',
  cancel: 'Cancelar',
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'],
  dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  today: 'Hoy',
  weekHeader: 'Semana',
  weak: 'Débil',
  medium: 'Media',
  strong: 'Fuerte',
  passwordPrompt: 'Ingrese la contraseña',
  emptyMessage: 'No se encontró ningún resultado',
  emptyFilterMessage: 'No se encontró ningún resultado'
};

export const navs: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'fas fa-tachometer-alt',
    href: '/home',
    permission: [],
  },
  {
    label: 'Bancos',
    icon: 'fas fa-university',
    href: '/banks',
    permission: [], // set permissions
  },
  {
    label: 'Clientes',
    icon: 'fas fa-id-card-alt',
    href: '/debtors',
    permission: [], // set permissions
  },
  {
    label: 'Garantes',
    icon: 'fas fa-people-arrows',
    href: '/guarantors',
    permission: [], // set permissions
  },
  {
    label: 'Monedas',
    icon: 'fas fa-money-bill-alt',
    href: '/currencies',
    permission: [], // set permissions
  },
  {
    label: 'Negocios',
    icon: 'fas fa-building',
    href: '/businesses',
    permission: [], // set permissions
  },
  {
    label: 'Usuarios',
    icon: 'fas fa-users',
    href: '/users',
    permission: [],
    admin: true,
  },
  {
    label: 'Transacciones',
    icon: 'fas fa-cash-register',
    href: '/transactions',
    permission: [], // set permissions
  },
];

export const genderOptions: { value: string; label: string }[] = [
  { value: 'female', label: translate('female') },
  { value: 'male', label: translate('male') },
];

export const maritalStatusOptions: { value: string; label: string }[] = [
  { value: 'single', label: translate('single') },
  { value: 'married', label: translate('married') },
  { value: 'divorced', label: translate('divorced') },
  { value: 'widowed', label: translate('widowed') },
];
