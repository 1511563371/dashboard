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
  <v-container class="pa-0" fluid>
    <v-card flat>
      <v-card-title class="px-0">
        <BaseFilter
          :default="{ items: [], text: $t('filter.rule_name'), value: 'search' }"
          :filters="filters"
          :reload="false"
          @filter="customFilter"
          @refresh="m_filter_list"
        />
        <v-chip-group v-model="amenities" class="ml-2 align-center" column multiple @change="onAlertStateChange">
          <v-badge
            v-for="(item, index) in alertStateArr"
            :key="index"
            bordered
            :class="`zoom-${Scale.toString().replaceAll('.', '-')} mx-3 mt-1`"
            :color="item[Object.keys(item)[0]]"
            :content="alertStatus[Object.keys(item)[0]] === 0 ? '0' : alertStatus[Object.keys(item)[0]]"
            overlap
            small
          >
            <v-chip
              class="font-weight-medium"
              :color="item[Object.keys(item)[0]]"
              label
              :outlined="amenities.indexOf(index) === -1"
              small
              :text-color="`${amenities.indexOf(index) === -1 ? item[Object.keys(item)[0]] : 'white'}`"
            >
              {{ Object.keys(item)[0] }}
            </v-chip>
          </v-badge>
        </v-chip-group>
        <v-spacer />
        <v-menu v-if="m_permisson_resourceAllow($route.query.env)" left>
          <template #activator="{ on }">
            <v-btn icon>
              <v-icon color="primary" v-on="on"> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="pa-2">
              <v-flex>
                <v-btn color="primary" text @click="addAlertRule">
                  <v-icon left>mdi-plus-box</v-icon>
                  {{ $root.$t('operate.create_c', [$root.$t('resource.prometheus_rule')]) }}
                </v-btn>
              </v-flex>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-card-title>
      <v-card-text class="px-0">
        <v-data-table
          class="kubegems__table-row-pointer"
          disable-filtering
          disable-sort
          :headers="headers"
          hide-default-footer
          item-key="index"
          :items="items"
          :items-per-page="itemsPerPage"
          :no-data-text="$root.$t('data.no_data')"
          :page.sync="page"
          show-expand
          single-expand
          @click:row="onRowClick"
          @page-count="pageCount = $event"
        >
          <template #[`item.data-table-select`]="{ item, index }">
            <v-checkbox
              v-model="m_table_batchResources[`${item.metadata.name}-${index + itemsPerPage * (page - 1)}`].checked"
              color="primary"
              hide-details
              @change="onResourceChange($event, item, `${index + itemsPerPage * (page - 1)}`)"
              @click.stop
            />
          </template>
          <template #[`item.name`]="{ item }">
            <v-flex :style="{ display: `flex` }">
              <a class="text-subtitle-2 kubegems__inline_flex" @click.stop="alertRuleDetail(item)">
                {{ item.name }}
              </a>
              <span v-if="item.state === 'inactive'" class="px-2">
                <v-chip class="font-weight-medium" color="success" small text-color="white">
                  {{ item.state }}
                </v-chip>
              </span>
              <span v-else-if="item.state === 'firing'" class="px-2">
                <v-chip class="font-weight-medium" color="error" small text-color="white">
                  {{ item.state }}
                </v-chip>
              </span>
              <span v-else class="px-2">
                <v-chip class="font-weight-medium" color="warning" small text-color="white">
                  {{ item.state }}
                </v-chip>
              </span>
              <v-flex v-if="item.channelStatus > 0" class="float-left">
                <v-menu nudge-right="20px" nudge-top="8px" open-on-hover right>
                  <template #activator="{ on }">
                    <span v-on="on">
                      <v-icon color="orange" small> mdi-alert-decagram </v-icon>
                    </span>
                  </template>
                  <v-card>
                    <v-card-text class="pa-2 text-caption">
                      {{ item.channelStatus === 1 ? $t('tip.channel_changed') : $t('tip.channel_lost') }}
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-flex>
            </v-flex>
          </template>
          <template v-if="AdminViewport" #[`item.namespace`]="{ item }">
            <v-menu v-if="item.namespace === SERVICE_MONITOR_NS" :close-delay="200" open-on-hover top>
              <template #activator="{ on, attrs }">
                <span v-bind="attrs" v-on="on">
                  {{ item.namespace }}
                </span>
              </template>
              <v-card>
                <v-card-text class="pa-2"> {{ $t('tip.global_alert') }} </v-card-text>
              </v-card>
            </v-menu>
            <span v-else>{{ item.namespace }}</span>
          </template>
          <template #[`item.promql`]="{ item }">
            <v-flex class="kubegems__break-all">{{ item.promql }}</v-flex>
          </template>
          <template #[`item.for`]="{ item }">
            {{ item.for }}
          </template>
          <template #[`item.receivers`]="{ item }">
            {{ item.receiversStr }}
          </template>
          <template #[`item.open`]="{ item }">
            <span v-if="item.isOpen">
              <v-icon color="primary" small> mdi-check-circle </v-icon>
              {{ $t('status.enabled') }}
            </span>
            <span v-else>
              <v-icon color="error" small> mdi-minus-circle </v-icon>
              {{ $t('status.disabled') }}
            </span>
          </template>
          <template #expanded-item="{ headers, item }">
            <td class="my-2 py-2" :colspan="headers.length">
              <span class="text-subtitle-2 kubegems__text">{{ $t('tip.message_template') }} : </span>
              <v-flex class="text-body-2 break-word">
                {{ item.message }}
              </v-flex>
            </td>
          </template>
          <template #[`item.action`]="{ item, index }">
            <v-flex :id="`r${index}`" />
            <v-menu :attach="`#r${index}`" left>
              <template #activator="{ on }">
                <v-btn icon>
                  <v-icon color="primary" small v-on="on"> mdi-dots-vertical </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-text class="pa-2">
                  <v-flex>
                    <v-btn color="primary" small text @click.stop="updateAlertRule(item)">
                      {{ $root.$t('operate.edit') }}
                    </v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn color="primary" small text @click.stop="switchBlackList(item)">
                      {{ item.isOpen ? $t('operate.disable') : $t('operate.enable') }}
                    </v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn color="error" small text @click.stop="removeAlertRule(item)">
                      {{ $root.$t('operate.delete') }}
                    </v-btn>
                  </v-flex>
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-data-table>
        <BasePagination
          v-if="pageCount >= 1"
          v-model="page"
          :front-page="true"
          :page-count="pageCount"
          :size="itemsPerPage"
          @changepage="onPageIndexChange"
          @changesize="onPageSizeChange"
          @loaddata="alertRuleList"
        />
      </v-card-text>
    </v-card>
    <AddAlertRule ref="addAlertRule" mode="logging" @refresh="alertRuleList" />
    <UpdateAlertRule ref="updateAlertRule" mode="logging" @refresh="alertRuleList" />
  </v-container>
</template>

<script>
  import { mapGetters, mapState } from 'vuex';

  import messages from '../../i18n';
  import { deleteLogAlertRule, getLogAlertRuleList, postDisableAlertRule, postEnableAlertRule } from '@/api';
  import { SERVICE_MONITOR_NS } from '@/constants/namespace';
  import BaseFilter from '@/mixins/base_filter';
  import BasePermission from '@/mixins/permission';
  import BaseResource from '@/mixins/resource';
  import BaseTable from '@/mixins/table';
  import { deepCopy } from '@/utils/helpers';
  import AddAlertRule from '@/views/observe/monitor/config/prometheusrule/components/AddPrometheusRule';
  import UpdateAlertRule from '@/views/observe/monitor/config/prometheusrule/components/UpdatePrometheusRule';

  export default {
    name: 'AlertRule',
    i18n: {
      messages: messages,
    },
    components: {
      AddAlertRule,
      UpdateAlertRule,
    },
    mixins: [BaseFilter, BasePermission, BaseResource, BaseTable],
    props: {
      pass: {
        type: Boolean,
        default: () => false,
      },
    },
    data() {
      return {
        items: [],
        itemsCopy: [],
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        params: {
          state: '',
          isAdmin: false,
        },
        amenities: [],
        alertStatus: { inactive: 0, firing: 0, pending: 0 },
        alertStateFilter: [],
        alertStateArr: [{ inactive: 'success' }, { pending: 'warning' }, { firing: 'error' }],
        cluster: undefined,
        namespace: undefined,
      };
    },
    computed: {
      ...mapState(['JWT', 'AdminViewport', 'Scale']),
      ...mapGetters(['Environment']),
      headers() {
        const items = [
          { text: this.$t('table.name'), value: 'name', align: 'start' },
          { text: this.$t('table.expr'), value: 'expr', align: 'start' },
          { text: this.$t('table.for'), value: 'for', align: 'start' },
          { text: this.$root.$t('resource.receiver'), value: 'receivers', align: 'start' },
          { text: this.$t('table.status'), value: 'open', align: 'start', width: 80 },
        ];
        if (this.m_permisson_resourceAllow(this.$route.query.env)) {
          items.push({ text: '', value: 'action', align: 'center', width: 20 });
        }
        items.push({ text: '', value: 'data-table-expand' });
        return items;
      },
      SERVICE_MONITOR_NS() {
        return SERVICE_MONITOR_NS;
      },
      filters() {
        return [{ text: this.$t('filter.rule_name'), value: 'search', items: [] }];
      },
    },
    watch: {
      '$route.query': {
        handler(newValue) {
          const { cluster, namespace } = this.params;
          const { cluster: newCluster, namespace: newNamespace } = newValue;
          const needRefresh = (cluster !== newCluster || namespace !== newNamespace) && this.pass;
          if (needRefresh) {
            this.m_table_generateParams();
            this.alertRuleList();
          }
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      customFilter() {
        if (this.$route.query.search) {
          this.items = this.itemsCopy.filter((item) => {
            return (
              item.name && item.name.toLocaleLowerCase().indexOf(this.$route.query.search.toLocaleLowerCase()) > -1
            );
          });
        } else {
          this.items = this.itemsCopy;
        }
        // this.m_table_generateSelectResource()
      },
      initAlertStatus() {
        this.alertStatus = { inactive: 0, firing: 0, pending: 0 };
        this.items.forEach((item) => {
          this.alertStatus[item.state]++;
        });
      },
      stateFilter() {
        this.items = this.itemsCopy.filter((item) => {
          return this.alertStateFilter.length === 0 ? true : this.alertStateFilter.indexOf(item.state) !== -1;
        });
        // this.m_table_generateSelectResource()
      },
      async alertRuleList() {
        this.params.isAdmin = this.AdminViewport;
        const { cluster, namespace } = this.$route.query;
        this.cluster = cluster;
        this.namespace = namespace;
        if (!this.cluster || !this.namespace) return;

        const data = await getLogAlertRuleList(this.cluster, this.namespace, this.params);

        // 将index添加到id属性上
        this.items = [];
        this.items = data.map((item, index) => {
          return {
            index: index,
            metadata: {
              name: item.name,
              namespace: item.namespace,
            },
            name: item.name,
            receiversStr: (item.receivers || []).map((receiver) => receiver.alertChannel.name).join(', '),
            ...item,
          };
        });
        this.itemsCopy = deepCopy(this.items);
        this.initAlertStatus();
        // this.m_table_generateSelectResource()
        if (this.$route.query.search) this.customFilter();
      },
      onAlertStateChange() {
        this.alertStateFilter = [];
        this.alertStateArr.forEach((item, index) => {
          if (this.amenities.indexOf(index) !== -1) {
            this.alertStateFilter.push(Object.keys(item)[0]);
          }
        });
        this.stateFilter();
      },
      alertRuleDetail(item) {
        this.$router.push({
          name: 'log-alert-detail',
          params: Object.assign(this.$route.params, {
            namespace: item.namespace,
            name: item.name,
          }),
          query: this.$route.query,
        });
      },
      addAlertRule() {
        this.$refs.addAlertRule.open();
      },
      updateAlertRule(item) {
        this.$refs.updateAlertRule.open();
        this.$refs.updateAlertRule.init(item);
      },
      removeAlertRule(item) {
        this.$store.commit('SET_CONFIRM', {
          title: this.$root.$t('operate.delete_c', [this.$root.$t('resource.prometheus_rule')]),
          content: {
            text: `${this.$root.$t('operate.delete_c', [this.$root.$t('resource.prometheus_rule')])} ${item.name}`,
            type: 'delete',
            name: item.name,
          },
          param: { item },
          doFunc: async (param) => {
            await deleteLogAlertRule(this.cluster, param.item.namespace, param.item.name);
            this.alertRuleList();
          },
        });
      },
      async switchBlackList(item) {
        if (item.isOpen) {
          this.$store.commit('SET_CONFIRM', {
            title: this.$t('operate.disable_c', [this.$root.$t('resource.prometheus_rule')]),
            content: {
              text: `${this.$t('operate.disable_c', [this.$root.$t('resource.prometheus_rule')])} ${item.name}`,
              type: 'confirm',
            },
            param: { item },
            doFunc: async (param) => {
              await postDisableAlertRule(this.cluster, param.item.namespace, param.item.name);
              this.alertRuleList();
            },
          });
        } else {
          this.$store.commit('SET_CONFIRM', {
            title: this.$t('operate.enable_c', [this.$root.$t('resource.prometheus_rule')]),
            content: {
              text: `${this.$t('operate.enable_c', [this.$root.$t('resource.prometheus_rule')])} ${item.name}`,
              type: 'confirm',
            },
            param: { item },
            doFunc: async (param) => {
              await postEnableAlertRule(this.cluster, param.item.namespace, param.item.name);
              this.alertRuleList();
            },
          });
        }
      },
      onPageSizeChange(size) {
        this.page = 1;
        this.itemsPerPage = size;
      },
      onPageIndexChange(page) {
        this.page = page;
      },
      onRowClick(item, { expand, isExpanded }) {
        expand(!isExpanded);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .break-word {
    word-break: break-all;
  }
  .chip-width {
    width: 70px;
    display: block;
    text-align: center;
  }
  .font-weight {
    font-weight: 600;
  }
</style>
