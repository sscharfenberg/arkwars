<script>
    /*******************************************************************************************************************
     * Pdus
     * this component shows a PDU summary
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    export default {
        props: {
            planetId: {
                type: String,
                required: true
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            pdus () { return this.$store.getters.pdusByPlanetId(this.planetId); },
            activePdus () { return this.$store.getters.pdusByPlanetId(this.planetId).filter(pdu => pdu.isActive); }
        }
    };
</script>

<template>
    <div class="pdu">
        <button class="pdu__btn">
            <icon name="pdu" />
            <div class="pdu__list">
                <div class="pdu__list-item"
                     v-for="pdu in activePdus" :key="pdu.id"></div>
            </div>
        </button>
    </div>
</template>


<style lang="scss" scoped>
    .pdu {
        &__btn {
            display: flex;
            align-items: center;

            box-sizing: content-box;
            height: 2.6rem;
            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "abbey");
            margin: 0 0 0.8rem 0;

            background: transparent;
            color: palette("text");

            cursor: pointer;

            &[disabled] {
                cursor: not-allowed;
            }
        }

        &__list {
            display: flex;
            flex-wrap: wrap;

            max-width: 4rem;
            margin: 4px 0 0 10px;
        }

        &__list-item {
            width: 4px;
            height: 4px;
            margin: 0 4px 4px 0;

            background: linear-gradient(to bottom, palette("state", "success") 0%, palette("state", "online") 100%);

            border-radius: 50%;
        }
    }
</style>
