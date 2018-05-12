<script>
/***********************************************************************************************************************
 * Available Ship Classes
 * this component lists the available ship classes
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    components: {
        Icon
    },
    computed: {
        shipClasses () { return this.$store.getters.shipClasses; }
    }
};
</script>

<template>
    <ul class="class-list">
        <li
            class="ship-class"
            v-for="sc in shipClasses"
            :key="sc.id">
            <div class="ship-class__name">
                <icon :name="`hull-${sc.hullType}`" />
                {{ sc.name }}
            </div>
            <div class="ship-class__kto">
                {{ sc.kto }}.000to
            </div>
            <div class="ship-class__speed">
                {{ sc.speed }}g
            </div>
            <div class="ship-class__ftl">
                {{ sc.ftl ? "ftl" : "" }}
            </div>
            <div class="ship-class__actions">actions</div>
            <div class="ship-class__modules">
                {{ sc.modules }}
            </div>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .class-list {
        padding: 0;
        margin: 0;
        flex-basis: 100%;

        list-style: none;
    }

    .ship-class {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 1rem 0 0 0;

        background-color: palette("grey", "bunker");

        &__name,
        &__kto,
        &__speed,
        &__ftl,
        &__modules {
            margin-left: 0.5rem;
        }

        &__name {
            display: flex;
            align-items: center;

            svg { margin-right: 1rem; }
        }

        &__modules {
            //margin-left: auto;
            flex-basis: 100%;

            @include respond-to("medium") {
                margin-left: auto;
                flex-basis: auto;
            }
        }

        &__actions {
            //order: 6;

            margin-left: auto;

            background: palette("brand", "viking");

            @include respond-to("medium") {
                order: 6;

                margin-left: 0.5rem;
            }
        }
    }
</style>
