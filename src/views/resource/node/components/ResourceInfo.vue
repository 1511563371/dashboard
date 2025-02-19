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
  <div>
    <v-card>
      <BaseSubTitle class="pt-2" :divider="false" :title="$t('tip.resource_statics')" />
      <v-row class="mt-2">
        <v-col cols="4">
          <BaseRadialBarChart
            id="node_cpu"
            class="my-3"
            :extend-height="200"
            :metrics="cpuSeries"
            :title="$root.$t('resource.cpu')"
            :total="totalRequests['cpu'] ? sizeOfCpu(item.status.capacity['cpu']) : 0"
            unit="core"
            :val="totalRequests['cpu'] ? sizeOfCpu(totalRequests['cpu']) : 0"
          />
        </v-col>
        <v-col cols="4">
          <BaseRadialBarChart
            id="node_memory"
            class="my-3"
            :extend-height="200"
            :metrics="memorySeries"
            :title="$root.$t('resource.memory')"
            :total="totalRequests['memory'] ? sizeOfStorage(item.status.capacity['memory']) : 0"
            unit="Gi"
            :val="totalRequests['memory'] ? sizeOfStorage(totalRequests['memory']) : 0"
          />
        </v-col>
        <v-col cols="4">
          <BaseRadialBarChart
            id="node_pod"
            class="my-3"
            :extend-height="200"
            :metrics="podSeries"
            :title="$root.$t('resource.pod')"
            :total="item ? parseInt(item.status.capacity.pods) : 0"
            unit=""
            :val="podCount"
          />
        </v-col>
      </v-row>

      <v-expand-transition>
        <v-row v-if="showMore && tke">
          <v-col cols="4">
            <BaseRadialBarChart
              id="node_tke_gpu"
              class="my-3"
              :extend-height="200"
              :metrics="gpuTkeSeries"
              :title="`Tke ${$root.$t('resource.gpu')}`"
              :total="
                totalRequests['tencent.com/vcuda-core'] ? parseInt(item.status.capacity['tencent.com/vcuda-core']) : 0
              "
              unit=""
              :val="totalRequests['tencent.com/vcuda-core'] ? parseFloat(totalRequests['tencent.com/vcuda-core']) : 0"
            />
          </v-col>
          <v-col cols="4">
            <BaseRadialBarChart
              id="node_tke_memory"
              class="my-3"
              :extend-height="200"
              :metrics="gpuTkeMemorySeries"
              :title="`Tke ${$root.$t('resource.video_memory')}`"
              :total="
                totalRequests['tencent.com/vcuda-memory']
                  ? parseInt(item.status.capacity['tencent.com/vcuda-memory'])
                  : 0
              "
              unit=""
              :val="
                totalRequests['tencent.com/vcuda-memory'] ? parseFloat(totalRequests['tencent.com/vcuda-memory']) : 0
              "
            />
          </v-col>
        </v-row>

        <v-row v-if="showMore && nvidia">
          <v-col cols="4">
            <BaseRadialBarChart
              id="node_nvidia_gpu"
              class="my-3"
              :extend-height="200"
              :metrics="gpuNvidiaSeries"
              :title="`Nvidia ${$root.$t('resource.gpu')}`"
              :total="totalRequests['nvidia.com/gpu'] ? parseInt(item.status.capacity['nvidia.com/gpu']) : 0"
              unit=""
              :val="totalRequests['nvidia.com/gpu'] ? parseFloat(totalRequests['nvidia.com/gpu']) : 0"
            />
          </v-col>
        </v-row>
      </v-expand-transition>

      <div v-if="tke || nvidia" class="pb-3 text-center">
        <v-btn color="primary" small text @click="showMore = !showMore">
          {{ showMore ? `${$t('operate.hide')} GPU` : `${$t('operate.show')} GPU` }}
        </v-btn>
      </div>
    </v-card>

    <v-card class="mt-6" flat>
      <v-sheet class="pa-2">
        <BaseListItemForDetail class="pt-0" :mt="0" :title="$t('tip.architecture')">
          <template #content>
            {{ node ? node.status.nodeInfo.architecture : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail title="BootID">
          <template #content>
            {{ node ? node.status.nodeInfo.bootID : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.runtime_version')">
          <template #content>
            {{ node ? node.status.nodeInfo.containerRuntimeVersion : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.kernel_version')">
          <template #content>
            {{ node ? node.status.nodeInfo.kernelVersion : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.kubeproxy_version')">
          <template #content>
            {{ node ? node.status.nodeInfo.kubeProxyVersion : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.kubelet_version')">
          <template #content>
            {{ node ? node.status.nodeInfo.kubeletVersion : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail title="MachineID">
          <template #content>
            {{ node ? node.status.nodeInfo.machineID : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.os')">
          <template #content>
            {{ node ? node.status.nodeInfo.operatingSystem : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.os_version')">
          <template #content>
            {{ node ? node.status.nodeInfo.osImage : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.system_uuid')">
          <template #content>
            {{ node ? node.status.nodeInfo.systemUUID : '' }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.image_count')">
          <template #content>
            {{ node && node.status.images ? node.status.images.length : 0 }}
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail title="PodCIDR">
          <template #content>
            <v-chip class="mx-1 font-weight-medium" color="success" small text-color="white">
              {{ node ? node.spec.podCIDR : '' }}
            </v-chip>
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail title="PodCIDRs">
          <template #content>
            <v-chip
              v-for="(item, index) in node ? node.spec.podCIDRs : []"
              :key="index"
              class="mx-1 font-weight-medium"
              color="success"
              small
              text-color="white"
            >
              {{ item }}
            </v-chip>
          </template>
        </BaseListItemForDetail>

        <BaseListItemForDetail :title="$t('tip.volume')">
          <template #content>
            attached :
            {{ node && node.status.volumesAttached ? node.status.volumesAttached.length : 0 }}/ inuse :
            {{ node && node.status.volumesInUse ? node.status.volumesInUse.length : 0 }}
          </template>
        </BaseListItemForDetail>
      </v-sheet>
    </v-card>

    <v-card class="mt-3" flat>
      <BaseSubTitle class="pt-2" :divider="false" :title="$t('tip.condition')" />
      <v-simple-table class="mx-2 pa-2 pb-3">
        <template #default>
          <thead>
            <tr>
              <th class="text-left">Reason</th>
              <th class="text-left">{{ $t('table.status') }}</th>
              <th class="text-left">Type</th>
              <th class="text-left">Message</th>
              <th class="text-left">{{ $t('tip.last_update_at') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in node ? node.status.conditions : []" :key="item.type">
              <td>{{ item.reason }}</td>
              <td>
                <span v-if="item.status === 'True'">
                  <v-icon color="primary" small> mdi-check-circle </v-icon>
                </span>
                <span v-else>
                  <v-icon color="error" small> mdi-minus-circle </v-icon>
                </span>
              </td>
              <td>{{ item.type }}</td>
              <td>{{ item.message }}</td>
              <td>{{ $moment(item.lastUpdateTime).format('lll') }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
  import messages from '../i18n';
  import { getNodeResourceAllocated } from '@/api';
  import { NODE_ONE_POD_RUNNING_COUNT_PROMQL } from '@/constants/prometheus';
  import BasePermission from '@/mixins/permission';
  import BaseResource from '@/mixins/resource';
  import { deepCopy, sizeOfCpu, sizeOfStorage } from '@/utils/helpers';

  export default {
    name: 'ResourceInfo',
    i18n: {
      messages: messages,
    },
    mixins: [BasePermission, BaseResource],
    props: {
      item: {
        type: Object,
        default: () => null,
      },
    },
    data() {
      return {
        totalLimits: {},
        totalRequests: {},
        podCount: 0,
        node: null,
        showMore: false,
      };
    },
    computed: {
      tke() {
        if (this.item?.metadata?.labels) {
          return this.item?.metadata?.labels['tencent.com/vcuda'] === 'true';
        }
        return false;
      },
      nvidia() {
        if (this.item?.metadata?.labels) {
          return this.item?.metadata?.labels['nvidia.com/gpu'] === 'true';
        }
        return false;
      },
      cpuSeries() {
        return this.totalRequests['cpu'] && this.item.status.capacity['cpu']
          ? [
              [
                sizeOfCpu(this.item.status.capacity['cpu']) === 0
                  ? 0
                  : (sizeOfCpu(this.totalRequests['cpu']) / sizeOfCpu(this.item.status.capacity['cpu'])) * 100,
                100 -
                  (sizeOfCpu(this.item.status.capacity['cpu']) === 0
                    ? 0
                    : (sizeOfCpu(this.totalRequests['cpu']) / sizeOfCpu(this.item.status.capacity['cpu'])) * 100),
              ],
            ]
          : [[0, 100]];
      },
      memorySeries() {
        return this.totalRequests['memory'] && this.item.status.capacity['memory']
          ? [
              [
                sizeOfStorage(this.item.status.capacity['memory']) === 0
                  ? 0
                  : (sizeOfStorage(this.totalRequests['memory']) / sizeOfStorage(this.item.status.capacity['memory'])) *
                    100,
                100 -
                  (sizeOfStorage(this.item.status.capacity['memory']) === 0
                    ? 0
                    : (sizeOfStorage(this.totalRequests['memory']) /
                        sizeOfStorage(this.item.status.capacity['memory'])) *
                      100),
              ],
            ]
          : [[0, 100]];
      },

      gpuTkeSeries() {
        return this.totalRequests['tencent.com/vcuda-core'] && this.item.status.capacity['tencent.com/vcuda-core']
          ? [
              [
                parseInt(this.item.status.capacity['tencent.com/vcuda-core']) === 0
                  ? 0
                  : (parseInt(this.totalRequests['tencent.com/vcuda-core']) /
                      parseInt(this.item.status.capacity['tencent.com/vcuda-core'])) *
                    100,
                100 -
                  (parseInt(this.item.status.capacity['tencent.com/vcuda-core']) === 0
                    ? 0
                    : (parseInt(this.totalRequests['tencent.com/vcuda-core']) /
                        parseInt(this.item.status.capacity['tencent.com/vcuda-core'])) *
                      100),
              ],
            ]
          : [[0, 100]];
      },

      gpuNvidiaSeries() {
        return this.totalRequests['nvidia.com/gpu'] && this.totalLimits['nvidia.com/gpu']
          ? [
              [
                parseInt(this.totalLimits['nvidia.com/gpu']) === 0
                  ? 0
                  : (parseInt(this.totalRequests['nvidia.com/gpu']) / parseInt(this.totalLimits['nvidia.com/gpu'])) *
                    100,
                100 -
                  (parseInt(this.totalLimits['nvidia.com/gpu']) === 0
                    ? 0
                    : (parseInt(this.totalRequests['nvidia.com/gpu']) / parseInt(this.totalLimits['nvidia.com/gpu'])) *
                      100),
              ],
            ]
          : [[0, 100]];
      },

      gpuTkeMemorySeries() {
        return this.totalRequests['tencent.com/vcuda-memory'] && this.item.status.capacity['tencent.com/vcuda-memory']
          ? [
              [
                parseInt(this.item.status.capacity['tencent.com/vcuda-memory']) === 0
                  ? 0
                  : (parseInt(this.totalRequests['tencent.com/vcuda-memory']) /
                      parseInt(this.item.status.capacity['tencent.com/vcuda-memory'])) *
                    100,
                100 -
                  (parseInt(this.item.status.capacity['tencent.com/vcuda-memory']) === 0
                    ? 0
                    : (parseInt(this.totalRequests['tencent.com/vcuda-memory']) /
                        parseInt(this.item.status.capacity['tencent.com/vcuda-memory'])) *
                      100),
              ],
            ]
          : [[0, 100]];
      },

      podSeries() {
        return this.item
          ? parseInt(this.item.status.capacity.pods) === 0
            ? [[0, 100]]
            : [
                [
                  (this.podCount / parseInt(this.item.status.capacity.pods)) * 100,
                  100 - (this.podCount / parseInt(this.item.status.capacity.pods)) * 100,
                ],
              ]
          : [[0, 100]];
      },
    },
    watch: {
      item() {
        this.node = deepCopy(this.item);
        this.loadMetrics();
      },
    },
    mounted() {
      if (this.item) {
        this.loadMetrics();
        this.node = deepCopy(this.item);
      }
    },
    methods: {
      sizeOfCpu: sizeOfCpu,
      sizeOfStorage: sizeOfStorage,
      async loadMetrics() {
        this.nodeAllocated();
        this.nodePodCountOne();
      },
      async nodeAllocated() {
        const data = await getNodeResourceAllocated(this.ThisCluster, this.$route.params.name, {
          noprocessing: true,
        });
        this.totalLimits = data.TotalLimits;
        this.totalRequests = data.TotalRequests;
      },
      async nodePodCountOne() {
        const data = await this.m_permission_vector(this.ThisCluster, {
          query: NODE_ONE_POD_RUNNING_COUNT_PROMQL.replaceAll('$1', this.item.metadata.name),
          noprocessing: true,
        });
        data.forEach((d) => {
          this.podCount = parseInt(d?.value[1] || 0);
        });
      },
    },
  };
</script>
