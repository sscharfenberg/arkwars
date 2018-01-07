<script>
    /*******************************************************************************************************************
     * Star
     * this component displays a single star
     ******************************************************************************************************************/
    export default {
        props: {
            spectral: {
                type: String,
                required: true
            },
            coordX: {
                type: Number,
                required: true
            },
            coordY: {
                type: Number,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }
    };
</script>

<template>
    <div>
        {{ name }}
        {{ spectral }}
        {{ coordX }}/{{ coordY }}
    </div>
</template>

<style lang="scss" scoped>
    div {
        background: palette("brand", "christine");
    }
</style>
