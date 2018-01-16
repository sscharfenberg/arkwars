<script>
    import Icon from "Game/common/Icon/Icon.vue";
    import cfg from "Config";
    export default {
        props: {
            harvesterId: {
                type: String,
                required: true
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            harvester () { return this.$store.getters.harvesterById(this.harvesterId); },
            finalProduction () {
                return Math.floor(this.harvester.resGrade * this.baseProductionValue);
            },
            baseProductionValue () {
                console.log(cfg);
                return cfg.rules.harvesters.build
                    .find( harvester => harvester.type === this.harvester.resourceType).baseProduction;
            },
            baseProductionLabel () {
                const harvesterName = this.$t("planet.harvesters.names." + this.harvester.resourceType);
                return this.$t("planet.harvesters.production.base", {type: harvesterName});
            },
            resGradeLabel () {
                const resName = this.$t("common.resourceTypes." + this.harvester.resourceType);
                return this.$t("planet.harvesters.production.resGrade", {type: resName});
            }
        }
    };
</script>

<template>
    <table>
        <colgroup>
            <col width="70%" />
            <col width="30%" />
        </colgroup>
        <thead>
            <tr>
                <th class="title" colspan="2">{{$t("planet.harvesters.production.title")}}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th>{{baseProductionLabel}}</th>
                <td>
                    <div class="value-base">
                        {{baseProductionValue}}
                        <icon :name="`res-${harvester.resourceType}`" />
                    </div>
                </td>
            </tr>
            <tr>
                <th>{{resGradeLabel}}</th>
                <td>
                    <div class="value-base">
                        {{ harvester.resGrade }}
                    </div>
                </td>
            </tr>
            <tr>
                <th>{{$t("planet.harvesters.production.finalProd")}}</th>
                <td>
                    <div class="value-base">
                        {{finalProduction}}
                        <icon :name="`res-${harvester.resourceType}`" />
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style lang="scss" scoped>
    table {
        width: 100%;

        tr {
            margin-bottom: 0.2rem;
        }

        th,
        td {
            padding: 0.5rem 1rem;

            vertical-align: top;
        }

        thead th {
            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "raven");
        }

        tbody th {
            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "deep");

            font-weight: inherit;
        }

        tbody td {
            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "deep");

            vertical-align: middle;
        }

        .value-base {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-wrap: wrap;

            height: 2.4rem;

            > svg {
                margin-left: 0.5rem;
            }
        }
    }
</style>
