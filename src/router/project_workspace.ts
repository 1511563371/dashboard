import { RouteConfig } from 'vue-router';

const prefix = 'tenants/:tenant?/projects/:project?';

export const projectWorkspace: RouteConfig[] = [
  {
    path: '/',
    name: 'project',
    component: (): Promise<typeof import('*.vue')> => import('@/layouts/Layout.vue'),
    redirect: { name: 'project-detail' },
    children: [
      {
        path: '',
        meta: {
          header: 'routerbar.cluster.h_dashboard',
          title: 'routerbar.cluster.g_dashboard',
          icon: 'mdi-view-dashboard',
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: 'project-detail' },
        children: [
          // project
          {
            path: `${prefix}/dashboard-project`,
            name: 'project-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/project/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.project_dashboaed',
              icon: 'mdi-view-dashboard',
              show: true,
              rootName: 'project',
              tip: 'project',
            },
          },
        ],
      },
      {
        path: '',
        meta: {
          header: 'routerbar.cluster.h_appmanifest',
          title: 'routerbar.cluster.g_app',
          icon: 'mdi-view-grid',
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: 'appmanifest-list' },
        children: [
          // app
          {
            path: `${prefix}/appmanifests`,
            name: 'appmanifest-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/appmanifest/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.app_manifest',
              icon: 'mdi-apps',
              show: true,
              rootName: 'project',
              tip: 'appmanifest',
            },
          },
          {
            path: `${prefix}/appmanifests/:name`,
            name: 'appmanifest-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/appmanifest/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.app_manifest',
              icon: 'mdi-apps',
              show: false,
              rootName: 'project',
              tip: 'appmanifest',
            },
          },
          // registry
          {
            path: `${prefix}/registrys`,
            name: 'registry-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/registry/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.registry',
              icon: 'mdi-database',
              show: true,
              rootName: 'project',
              tip: 'registry',
            },
          },
        ],
      },
    ],
  },
];
