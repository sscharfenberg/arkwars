<script>
/***********************************************************************************************************************
 * shows the research progress
 **********************************************************************************************************************/
export default {
    props: {
        tlType: {
            type: String,
            required: true
        },
        remaining: {
            type: Number,
            required: true
        },
        newLevel: {
            type: Number,
            required: true
        }
    }
};
</script>

<template>
    <div>researching TL{{ newLevel }} for {{ tlType }}. Remaining Work: {{ remaining }}</div>
</template>

<style lang="scss" scoped>
    div {
        padding: 1rem 0;
    }
</style>
