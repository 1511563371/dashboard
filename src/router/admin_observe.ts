import { RouteConfig } from 'vue-router';

const prefix = 'admin';

export const adminObserve: RouteConfig[] = [
  {
    path: '/admin-observe',
    name: 'admin-observe',
    component: (): Promise<typeof import('*.vue')> => import('@/layouts/Layout.vue'),
    redirect: { name: 'observe-overview' },
    children: [
      // overview
      {
        path: '',
        meta: {
          header: 'routerbar.observability.h_dashboard',
          title: 'routerbar.observability.g_dashboard',
          icon: 'mdi-tablet-dashboard',
          show: true,
        },
        redirect: { name: `${prefix}-observe-overview` },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        children: [
          {
            path: `overview`,
            name: `${prefix}-observe-overview`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/overview/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.dashboard',
              admin: true,
              icon: 'mdi-home',
              show: true,
              rootName: 'admin-observe',
              tip: 'observe',
            },
          },
        ],
      },

      /**
       * 接入中心
       */
      {
        path: 'integrated',
        meta: {
          header: 'routerbar.observability.h_integrated',
          title: 'routerbar.observability.g_integrated',
          icon: 'mdi-link-variant',
          show: true,
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `${prefix}-observe-integrated` },
        children: [
          {
            path: `components`,
            name: `${prefix}-observe-integrated`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/integrated/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.integrated',
              admin: true,
              icon: 'mdi-widgets',
              show: true,
              rootName: 'admin-observe',
              tip: 'integrated',
            },
          },
        ],
      },

      /**
       * 可视化
       */
      {
        path: 'dash',
        meta: {
          header: 'routerbar.observability.h_observability',
          title: 'routerbar.observability.g_observability',
          icon: 'mdi-view-dashboard',
          show: true,
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `${prefix}-observe-monitor-dashboard` },
        children: [
          {
            path: `dashboard`,
            name: `${prefix}-observe-monitor-dashboard`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/monitor/dashboard/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.monitor_dahboard',
              admin: true,
              icon: 'mdi-gauge',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'dash_overview',
              innerCheck: true,
            },
          },
          {
            path: `appmonitor`,
            name: `${prefix}-observe-monitor-app`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/monitor/app/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.monitor_app',
              admin: true,
              icon: 'mdi-chart-line-stacked',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['tracing'],
              tip: 'dash_app',
              innerCheck: true,
            },
          },
        ],
      },
      {
        path: 'query',
        meta: {
          title: 'routerbar.observability.g_inquirer',
          icon: 'mdi-magnify',
          show: true,
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `${prefix}-observe-monitor-metrics` },
        children: [
          {
            path: `metrics`,
            name: `${prefix}-observe-monitor-metrics`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/monitor/metrics/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.metrics_inquirer',
              admin: true,
              icon: 'mdi-feature-search-outline',
              show: true,
              rootName: 'admin-observe',
              tip: 'dash_metrics',
              dependencies: ['monitoring'],
              innerCheck: true,
            },
          },
          {
            path: `viewer`,
            name: `${prefix}-log-viewer`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/log/viewer/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.log_inquirer',
              admin: true,
              icon: 'mdi-format-list-bulleted',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['logging'],
              tip: 'dash_log',
              innerCheck: true,
            },
          },
          {
            path: `search`,
            name: `${prefix}-observe-trace-search`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/trace/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.trace_inquirer',
              admin: true,
              icon: 'mdi-glasses',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['tracing'],
              tip: 'dash_trace',
              innerCheck: true,
            },
          },
        ],
      },

      /**
       * 告警中心
       */
      {
        path: 'alert',
        meta: {
          header: 'routerbar.observability.h_alert',
          title: 'routerbar.observability.g_alert',
          icon: 'mdi-alert',
          show: true,
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `${prefix}-observe-monitor-overview` },
        children: [
          {
            path: `overview`,
            name: `${prefix}-observe-monitor-overview`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/alert/dashboard/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.alert_dashboard',
              admin: true,
              icon: 'mdi-monitor-dashboard',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'alert_overview',
              innerCheck: true,
            },
          },
          {
            path: `history`,
            name: `${prefix}-observe-alert-history`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/alert/history/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.alert_history',
              admin: true,
              icon: 'mdi-history',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'alert_history',
              innerCheck: true,
            },
          },
          {
            path: `blacklist`,
            name: `${prefix}-observe-alert-blacklist`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/alert/blacklist/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.alert_blacklist',
              admin: true,
              icon: 'mdi-playlist-remove',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'alert_blacklist',
              innerCheck: true,
            },
          },
        ],
      },

      /**
       * 配置中心
       */
      {
        path: 'config',
        meta: {
          header: 'routerbar.observability.h_setting',
          title: 'routerbar.observability.g_setting',
          icon: 'mdi-wrench',
          show: true,
        },
        component: (): Promise<typeof import('*.vue')> => import('@/layouts/Container.vue'),
        redirect: { name: `${prefix}-observe-monitor-config` },
        children: [
          {
            path: `monitor/config`,
            name: `${prefix}-observe-monitor-config`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/monitor/config/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.mertic_setting',
              admin: true,
              icon: 'mdi-format-list-bulleted',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'config_monitor',
              innerCheck: true,
            },
          },
          {
            path: `monitor/config/detail/servicemonitor/:name`,
            name: `${prefix}-servicemonitor-detail`,
            component: (): Promise<typeof import('*.vue')> =>
              import('@/views/observe/monitor/config/servicemonitor/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.servicemonitor',
              admin: true,
              icon: 'mdi-eyedropper',
              show: false,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'service_monitor',
              innerCheck: true,
            },
          },
          {
            path: `monitor/config/detail/prometheus-rule/:name`,
            name: `${prefix}-prometheusrule-detail`,
            component: (): Promise<typeof import('*.vue')> =>
              import('@/views/observe/monitor/config/prometheusrule/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.prometheusrule',
              admin: true,
              icon: 'mdi-ruler',
              show: false,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'prometheus_rule',
              innerCheck: true,
            },
          },
          {
            path: `log/config`,
            name: `${prefix}-log-config`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/log/config/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.log_setting',
              admin: true,
              icon: 'mdi-arrange-send-backward',
              show: true,
              rootName: 'admin-observe',
              dependencies: ['logging'],
              tip: 'log_monitor',
              innerCheck: true,
            },
          },

          {
            path: `log/config/flow-detail/:kind/:name`,
            name: `${prefix}-log-flow-detail`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/log/config/flow/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.flow',
              admin: true,
              icon: 'mdi-arrange-send-backward',
              show: false,
              rootName: 'admin-observe',
              dependencies: ['logging'],
              tip: 'flow',
              innerCheck: true,
            },
          },
          {
            path: `log/config/output-detail/:kind/:name`,
            name: `${prefix}-log-output-detail`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/log/config/output/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.output',
              admin: true,
              icon: 'mdi-router-wireless',
              show: false,
              rootName: 'admin-observe',
              dependencies: ['logging'],
              tip: 'output',
              innerCheck: true,
            },
          },
          {
            path: `log/config/alert-detail/:name`,
            name: `${prefix}-log-alert-detail`,
            component: (): Promise<typeof import('*.vue')> =>
              import('@/views/observe/log/config/alert_rule/detail.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.alertrule',
              admin: true,
              icon: 'mdi-ruler',
              show: false,
              rootName: 'admin-observe',
              dependencies: ['monitoring'],
              tip: 'prometheus_rule',
              innerCheck: true,
            },
          },
          {
            path: `channel`,
            name: `${prefix}-observe-channel`,
            component: (): Promise<typeof import('*.vue')> => import('@/views/observe/channel/index.vue'),
            meta: {
              requireAuth: true,
              title: 'routerbar.observability.channel',
              admin: true,
              icon: 'mdi-axis-arrow',
              show: true,
              rootName: 'admin-observe',
              tip: 'alert_channel',
              innerCheck: true,
            },
          },
        ],
      },
    ],
  },
];
