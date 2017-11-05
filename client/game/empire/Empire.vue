<template>
    <p>{{ greeting }} World from Vue!</p>
</template>

<script>
    module.exports = {
        data: function() {
            return {
                greeting: "Hello"
            };
        }
    };
</script>

<style scoped>
    p {
        font-size: 40px;
        text-align: right;
    }
</style>
