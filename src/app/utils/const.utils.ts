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

export const permissions = {
  country_view: 1,
  country_store: 2,
  country_update: 3,
  country_delete: 4,
  province_view: 5,
  province_store: 6,
  province_update: 7,
  province_delete: 8,
  debtor_view: 9,
  debtor_store: 10,
  debtor_update: 11,
  debtor_delete: 12,
  permision_view: 13,
  role_view: 14,
  role_store: 15,
  role_update: 16,
  role_delete: 17,
  user_view: 18,
  user_store: 19,
  user_update: 20,
  user_delete: 21,
  bank_view: 22,
  bank_store: 23,
  bank_update: 24,
  bank_delete: 25,
  loan_view: 26,
  loan_store: 27,
  loan_update: 28,
  loan_delete: 29,
  fee_view: 30,
  frequency_view: 31,
  transactions_view: 32,
  transactions_store: 33,
  currency_view: 34,
  currency_store: 35,
  currency_update: 36,
  currency_delete: 37,
  logtype_view: 38,
  log_view: 39,
  securitylog_view: 40,
  accesslist_view: 41,
  transactions_bank_store: 44,
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
    permission: [permissions.bank_view],
  },
  {
    label: 'Transacción',
    icon: 'fas fa-book-open',
    href: '/transactions',
    permission: [],
    children: [
      {
        label: 'Registrar',
        icon: 'fas fa-receipt',
        href: '/transactions/form',
        permission: [permissions.transactions_bank_store],
      },
      {
        label: 'Filter',
        icon: 'fas fa-filter',
        href: '/transactions/filter',
        permission: [permissions.transactions_bank_store],
      },
    ],
  },
  {
    label: 'Clientes',
    icon: 'fas fa-id-card-alt',
    href: '/debtors',
    permission: [permissions.debtor_view],
  },
  {
    label: 'Monedas',
    icon: 'fas fa-coins',
    href: '/currencies',
    permission: [permissions.currency_view],
  },
  {
    label: 'Usuarios',
    icon: 'fas fa-users',
    href: '/users',
    permission: [permissions.user_view],
  },
  {
    label: 'Prestamos',
    icon: 'fas fa-wallet',
    href: '/loans',
    permission: [],
    children: [
      {
        label: 'Listar',
        icon: 'fas fa-money-check-alt',
        href: '/loans/grid',
        permission: [permissions.loan_view],
      },
      {
        label: 'Crear',
        icon: 'fas fa-receipt',
        href: '/loans/form',
        permission: [permissions.loan_store],
      },
      {
        label: 'Pagos',
        icon: 'fas fa-money-bill-wave',
        href: '/loans/pay',
        permission: [permissions.transactions_store],
      },
    ]
  },
  {
    label: 'CxC',
    icon: 'fas fa-book-reader',
    href: '/cxc',
    permission: [permissions.loan_view],
  },
  {
    label: 'Calculadora',
    icon: 'fas fa-calculator',
    href: '/calculator',
    permission: [],
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

export const statusOptions: { value: string; label: string }[] = [
  { value: 'paid', label: 'Saldado' },
  { value: 'active', label: 'Activo' },
];

export const defaultPassword = 'Password1*';
