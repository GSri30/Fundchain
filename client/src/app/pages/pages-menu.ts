import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Profile',
    icon: 'person-outline',
    link: '/pages/userinfo',
    home: true,
  },
  {
    title: 'Dashboard',
    icon: 'grid-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Add Organization',
    icon: 'plus-outline',
    link: '/pages/addorg',
    home: true
  },
  {
    title: 'ORGANIZATIONS',
    group: true,
  },
  {
    title: 'Education',
    icon: 'book-open-outline',
    link: '/pages/education',
    home: true,
  },
  {
    title: 'Start Ups',
    icon: 'bulb-outline',
    link: '/pages/startup',
    home: true,
  },
  {
    title: 'Old Age Homes',
    link: '/pages/oldagehome',
    icon: 'home-outline',
    home: true,
  },
  {
    title: 'Health',
    link: '/pages/health',
    icon: 'activity-outline',
    home: true,
  },
  {
    title: 'Rural Development',
    link: '/pages/ruraldevelopment',
    icon: 'globe-2-outline',
    home: true,
  },
  {
    title: 'Nature',
    link: '/pages/nature',  
    icon: 'sun-outline',
    home: true,
  },
  {
    title: 'Farming',
    link: '/pages/farming',  
    icon: 'award-outline',
    home: true,
  },
  {
    title: 'Others',
    link: '/pages/others',  
    icon: 'plus-square-outline',
    home: true,
  },


];
