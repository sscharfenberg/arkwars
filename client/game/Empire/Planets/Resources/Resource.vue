<script>
    /*******************************************************************************************************************
     * Resource Type
     * this component shows built extractors and available slots
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            resourceType: {
                type: String,
                required: true
            },
            slots: {
                type: Number,
                required: true
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            getIconName () { return "res-" + this.resourceType; }
        }
    };
</script>

<template>
    <div>
        <!--<icon :name="getIconName" v-for="n in extractors" :key="n" />
        <icon :name="getIconName" v-for="n in (slots - extractors)" :key="n" style="opacity: 0.3" />-->
        {{ resourceType }} / {{ slots }}
    </div>
</template>


<style lang="scss" scoped>
    div {
        background: palette("grey", "raven");
    }
</style>
