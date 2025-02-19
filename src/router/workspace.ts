import { RouteConfig } from 'vue-router';

const prefix = 'tenants/:tenant?/projects/:project?/environments/:environment?';

export const workspace: RouteConfig[] = [
  {
    path: '/',
    name: 'workspace',
    component: (): Promise<typeof import('*.vue')> => import('@/layouts/Layout.vue'),
    redirect: { name: 'environment-detail' },
    children: [
      {
        path: '',
        meta: {
          header: 'routerbar.cluster.h_dashboard',
          title: 'routerbar.cluster.g_dashboard',
          icon: 'mdi-view-dashboard',
          required: ['tenant'],
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: 'environment-detail' },
        children: [
          // environment
          {
            path: `${prefix}/dashboard-environment`,
            name: 'environment-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/environment/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.environment_dashboaed',
              icon: 'mdi-cloud',
              show: true,
              rootName: 'workspace',
              tip: 'environment',
            },
          },
        ],
      },
      {
        path: '',
        meta: {
          header: 'routerbar.cluster.h_app',
          title: 'routerbar.cluster.h_app',
          icon: 'mdi-view-grid',
          required: ['tenant'],
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: 'app-list' },
        children: [
          // app
          {
            path: `${prefix}/apps`,
            name: 'app-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/app/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.app',
              icon: 'mdi-apps',
              show: true,
              rootName: 'workspace',
              tip: 'app',
            },
          },
          {
            path: `${prefix}/configs`,
            name: 'app-configer',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/app_configer/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.app_config',
              icon: 'mdi-wrench',
              show: false,
              pluginOpenShow: true,
              rootName: 'workspace',
              tip: 'appconfig',
              dependencies: ['nacos'],
            },
          },
          {
            path: `${prefix}/apps/:name`,
            name: 'app-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/app/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.app',
              icon: 'mdi-apps',
              show: false,
              rootName: 'workspace',
              tip: 'app',
            },
          },
          {
            path: `${prefix}/apps/:name/deploy`,
            name: 'app-deploy',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/deploy/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.app_deploy',
              icon: 'mdi-apps',
              show: false,
              rootName: 'workspace',
              tip: 'deploy',
              dependencies: ['argo-rollouts'],
            },
          },
        ],
      },
      {
        path: '',
        meta: {
          header: 'routerbar.cluster.h_container',
          title: 'routerbar.cluster.g_runtime',
          icon: 'mdi-application',
          required: ['tenant'],
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `workload-list` },
        children: [
          // workload
          {
            path: `${prefix}/workloads`,
            name: 'workload-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/workload/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.workload',
              upToAdmin: true,
              icon: 'mdi-vector-arrange-above',
              show: true,
              rootName: 'workspace',
              tip: 'workload',
            },
          },
          {
            path: `${prefix}/workloads/:name`,
            name: 'workload-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/workload/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.workload',
              upToAdmin: true,
              icon: 'mdi-vector-arrange-above',
              show: false,
              rootName: 'workspace',
              tip: 'workload',
            },
          },
          // pod
          {
            path: `${prefix}/pods`,
            name: 'pod-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/pod/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.pod',
              upToAdmin: true,
              icon: 'mdi-microsoft',
              show: true,
              rootName: 'workspace',
              tip: 'pod',
            },
          },
          {
            path: `${prefix}/pods/:name`,
            name: 'pod-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/pod/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.pod',
              upToAdmin: true,
              icon: 'mdi-microsoft',
              show: false,
              rootName: 'workspace',
              tip: 'pod',
            },
          },
          // service
          {
            path: `${prefix}/services`,
            name: 'service-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/service/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.service',
              upToAdmin: true,
              icon: 'mdi-dns',
              show: true,
              rootName: 'workspace',
              tip: 'service',
            },
          },
          {
            path: `${prefix}/services/:name`,
            name: 'service-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/service/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.service',
              upToAdmin: true,
              icon: 'mdi-dns',
              show: false,
              rootName: 'workspace',
              tip: 'service',
            },
          },
          // ingress
          {
            path: `${prefix}/ingress`,
            name: 'ingress-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/ingress/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.ingress',
              upToAdmin: true,
              icon: 'mdi-network',
              show: true,
              rootName: 'workspace',
              tip: 'ingress',
            },
          },
          {
            path: `${prefix}/ingress/:name`,
            name: 'ingress-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/ingress/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.ingress',
              upToAdmin: true,
              icon: 'mdi-network',
              show: false,
              rootName: 'workspace',
              tip: 'ingress',
            },
          },
          // gateway
          {
            path: `${prefix}/gateways`,
            name: 'gateway-center',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/gateway/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.gateway',
              upToAdmin: true,
              icon: 'mdi-gate',
              show: true,
              rootName: 'workspace',
              tip: 'gateway',
            },
          },
          {
            path: `${prefix}/gateways/:name`,
            name: 'gateway-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/gateway/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.gateway',
              upToAdmin: true,
              icon: 'mdi-gate',
              show: false,
              rootName: 'workspace',
              tip: 'gateway',
            },
          },
        ],
      },
      {
        path: '',
        meta: {
          title: 'routerbar.cluster.g_task',
          icon: 'mdi-playlist-check',
          required: ['tenant'],
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `job-list` },
        children: [
          // job
          {
            path: `${prefix}/jobs`,
            name: 'job-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/job/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.job',
              upToAdmin: true,
              icon: 'mdi-repeat-once',
              show: true,
              rootName: 'workspace',
              tip: 'job',
            },
          },
          {
            path: `${prefix}/jobs/:name`,
            name: 'job-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/job/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.job',
              upToAdmin: true,
              icon: 'mdi-repeat-once',
              show: false,
              rootName: 'workspace',
              tip: 'job',
            },
          },
          // cronjob
          {
            path: `${prefix}/cronjobs`,
            name: 'cronjob-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/cronjob/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.cronjob',
              upToAdmin: true,
              icon: 'mdi-calendar-clock',
              show: true,
              rootName: 'workspace',
              tip: 'cronjob',
            },
          },
          {
            path: `${prefix}/cronjobs/:name`,
            name: 'cronjob-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/cronjob/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.cronjob',
              upToAdmin: true,
              icon: 'mdi-calendar-clock',
              show: false,
              rootName: 'workspace',
              tip: 'cronjob',
            },
          },
        ],
      },
      {
        path: '',
        meta: {
          title: 'routerbar.cluster.g_config',
          icon: 'mdi-brightness-7',
          required: ['tenant'],
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `configmap-list` },
        children: [
          // configmap
          {
            path: `${prefix}/configmaps`,
            name: 'configmap-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/configmap/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.configmap',
              upToAdmin: true,
              icon: 'mdi-wrench',
              show: true,
              rootName: 'workspace',
              tip: 'configmap',
            },
          },
          {
            path: `${prefix}/configmaps/:name`,
            name: 'configmap-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/configmap/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.configmap',
              upToAdmin: true,
              icon: 'mdi-wrench',
              show: false,
              rootName: 'workspace',
              tip: 'configmap',
            },
          },
          // secret
          {
            path: `${prefix}/secrets`,
            name: 'secret-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/secret/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.secret',
              upToAdmin: true,
              icon: 'mdi-key-variant',
              show: true,
              rootName: 'workspace',
              tip: 'secret',
            },
          },
          {
            path: `${prefix}/secrets/:name`,
            name: 'secret-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/secret/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.secret',
              upToAdmin: true,
              icon: 'mdi-key-variant',
              show: false,
              rootName: 'workspace',
              tip: 'secret',
            },
          },
          // certmanager
          {
            path: `${prefix}/certmanager`,
            name: 'certmanager',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/certmanager/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.certmanager',
              upToAdmin: true,
              icon: 'mdi-book-open',
              show: true,
              rootName: 'workspace',
              tip: 'certmanager',
              dependencies: ['cert-manager'],
            },
          },
          {
            path: `${prefix}/certmanager/:name`,
            name: 'certificate-detail',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/certmanager/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.certmanager',
              upToAdmin: true,
              icon: 'mdi-book-open',
              show: false,
              rootName: 'workspace',
              tip: 'certmanager',
              dependencies: ['cert-manager'],
            },
          },
        ],
      },
      {
        path: '',
        meta: {
          title: 'routerbar.cluster.g_storage',
          icon: 'mdi-database',
          required: ['tenant'],
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `persistentvolumeclaim-list` },
        children: [
          // pvc
          {
            path: `${prefix}/persistentvolumeclaims`,
            name: 'persistentvolumeclaim-list',
            component: (): Promise<typeof import('*.vue')> =>
              import('@/views/resource/persistentvolumeclaim/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.persistentvolumeclaim',
              upToAdmin: true,
              icon: 'mdi-database',
              show: true,
              rootName: 'workspace',
              tip: 'persistentvolumeclaim',
            },
          },
          {
            path: `${prefix}/persistentvolumeclaims/:name`,
            name: 'persistentvolumeclaim-detail',
            component: (): Promise<typeof import('*.vue')> =>
              import('@/views/resource/persistentvolumeclaim/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.persistentvolumeclaim',
              upToAdmin: true,
              icon: 'mdi-database',
              show: false,
              rootName: 'workspace',
              tip: 'persistentvolumeclaim',
            },
          },
          // volumesnapshot
          {
            path: `${prefix}/volumesnapshots`,
            name: 'volumesnapshot-list',
            component: (): Promise<typeof import('*.vue')> => import('@/views/resource/volumesnapshot/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.cluster.volumesnapshot',
              upToAdmin: true,
              icon: 'mdi-camera',
              show: true,
              rootName: 'workspace',
              tip: 'volumesnapshot',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/console',
    name: 'terminal',
    component: (): Promise<typeof import('*.vue')> => import('@/layouts/LayoutWithoutNavi.vue'),
    redirect: { name: 'terminal-viewer' },
    children: [
      // terminal
      {
        path: `${prefix}/terminal/:name`,
        name: 'terminal-viewer',
        component: (): Promise<typeof import('*.vue')> => import('@/views/resource/terminal/index.vue'),
        meta: {
          requireAuth: true,
          title: 'routerbar.cluster.terminal',
          upToAdmin: true,
        },
      },
    ],
  },
  {
    path: '/container',
    name: 'container-log',
    component: (): Promise<typeof import('*.vue')> => import('@/layouts/LayoutWithoutNavi.vue'),
    redirect: { name: 'container-log-viewer' },
    children: [
      // terminal
      {
        path: `${prefix}/log/:name`,
        name: 'container-log-viewer',
        component: (): Promise<typeof import('*.vue')> => import('@/views/resource/log/index.vue'),
        meta: {
          requireAuth: true,
          title: 'routerbar.cluster.log',
          upToAdmin: true,
        },
      },
    ],
  },
];
