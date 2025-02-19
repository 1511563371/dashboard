<!--
 * Copyright 2022 The kubegems.io Authors
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *       http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
-->

<template>
  <BaseFullScreenDialog
    v-model="dialog"
    :action-top="4"
    icon="mdi-chart-areaspline-variant"
    :title="`${$t('tip.monitor_panel')}--${graph.name}`"
    @dispose="dispose"
  >
    <template #action>
      <BaseDatetimePicker v-model="date" color="primary" :default-value="30" @change="onDatetimeChange(undefined)" />
    </template>
    <template #content>
      <v-card flat :height="outerHeight" :style="{ overflowY: 'auto' }">
        <div :style="{ height: '36px' }">
          <BaseDropSelect
            v-for="label in labels"
            :key="label.text"
            v-model="label.value"
            :variable="label.text"
            :variable-values="label.items"
            @change="onLabelChange(label)"
          />
        </div>

        <div class="mx-2">
          <BaseAreaChart
            :animation="false"
            chart-type="line"
            :class="`clear-zoom-${Scale.toString().replaceAll('.', '-')}`"
            colorful
            :extend-height="height"
            :global-plugins-check="false"
            horizontal-align="left"
            label="all"
            legend-align="start"
            :metrics="metrics"
            single-tooptip
            title=""
            type=""
            :unit="graph.promqlGenerator ? getUnit(graph.promqlGenerator.unit) : getUnit(graph.unit)"
          />
        </div>
      </v-card>
    </template>
  </BaseFullScreenDialog>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  import messages from '../../i18n';
  import { getMetricsLabelValues, getMetricsLabels, getMetricsQueryrange, getRuleSearch } from '@/api';

  export default {
    name: 'GraphMax',
    i18n: {
      messages: messages,
    },
    props: {
      dateLink: {
        type: Array,
        default: () => [],
      },
      environment: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        dialog: false,
        graph: {},
        namespace: '',
        metrics: [],
        timeinterval: null,
        date: [],
        params: {
          start: null,
          end: null,
        },
        labels: [],
        labelpairs: {},
      };
    },
    computed: {
      ...mapState(['JWT', 'Scale']),
      ...mapGetters(['Tenant']),
      outerHeight() {
        return parseInt((window.innerHeight - 64) / this.Scale);
      },
      height() {
        return window.innerHeight - 64 * this.Scale - 100;
      },
    },
    watch: {
      dateLink: {
        handler(newValue) {
          if (newValue && newValue.length > 0) {
            this.date = newValue;
          }
        },
        deep: true,
        immediate: true,
      },
    },
    destroyed() {
      this.clearInterval();
    },
    methods: {
      open() {
        this.dialog = true;
      },
      async init(graph, namespace) {
        this.graph = graph;
        this.namespace = namespace;
        this.onDatetimeChange();
        await this.getLabel();
        this.getLabelItems();
      },
      async loadMetrics(newParams = {}) {
        this.clearInterval();
        this.getMetrics(newParams);
        this.timeinterval = setInterval(() => {
          this.params.start = this.$moment(this.params.start).utc().add(30, 'seconds').format();
          this.params.end = this.$moment(this.params.end).utc().add(30, 'seconds').format();
          this.getMetrics();
        }, 1000 * 30);
      },
      dispose() {
        this.graph = {};
        this.metrics = [];
        this.clearInterval();
      },
      clearInterval() {
        if (this.timeinterval) clearInterval(this.timeinterval);
      },
      async getMetrics(newParams = {}) {
        const params = this.graph.promqlGenerator
          ? this.graph.promqlGenerator
          : {
              expr: this.graph.expr,
              unit: this.graph.unit,
            };
        const data = await getMetricsQueryrange(this.environment.clusterName, this.namespace, {
          ...params,
          ...newParams,
          ...this.params,
        });
        this.metrics = data;
      },
      onDatetimeChange() {
        this.params.start = this.$moment(this.date[0]).utc().format();
        this.params.end = this.$moment(this.date[1]).utc().format();
        this.loadMetrics();
      },
      getUnit(unit) {
        if (unit === 'short') {
          return 'short';
        }
        if (unit && unit?.indexOf('-') > -1) {
          return unit.substr(unit.indexOf('-') + 1);
        }
        return unit;
      },
      async getLabel() {
        const data = {};
        let resData = {};
        let labelpairs = {};
        if (!this.graph.promqlGenerator) {
          resData = await getMetricsLabels(this.environment.clusterName, this.namespace, {
            expr: this.graph.expr,
            noprocessing: true,
          });
        } else {
          resData = await getRuleSearch(this.Tenant().ID, this.graph.promqlGenerator);
          resData = resData.labels;
        }
        const labels = resData?.filter((d) => {
          return ['__name__', 'id', 'job', 'metrics_path', 'instance', 'image'].indexOf(d) === -1;
        });
        labels.forEach((label) => {
          data[label] = {
            text: label,
            items: [],
            request: false,
            value: [],
          };
          labelpairs[label] = {};
        });
        this.labels = data;
      },
      getLabelItems() {
        Object.keys(this.labels).forEach(async (label) => {
          const params = this.graph.promqlGenerator
            ? this.graph.promqlGenerator
            : {
                expr: this.graph.expr,
                unit: this.graph.unit,
              };
          const data = await getMetricsLabelValues(
            this.environment.clusterName,
            this.namespace,
            Object.assign(params, { noprocessing: true, label: label }),
          );
          this.$set(this.labels[label], 'items', data);
        });
      },
      onLabelChange(label) {
        this.$set(this.labelpairs, label.text, label.value);
        let newParams = {};
        for (const key in this.labelpairs) {
          if (this.labelpairs[key] && this.labelpairs[key].length) {
            newParams[`labelpairs[${key}]`] = this.labelpairs[key].reduce(
              (pre, current, index, arr) => pre + current + `${index === arr.length - 1 ? '' : '|'}`,
              '',
            );
          }
        }

        this.loadMetrics(newParams);
      },
    },
  };
</script>
