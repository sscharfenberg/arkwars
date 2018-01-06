<template>
    <div
        class="spinner"
        v-show="status"
        :style="spinnerStyle"></div>
</template>

<script>
    /*
     * https://github.com/sergeyloysha/vue-spinner-component/
     */
    export default {
        props: {
            status: {
                type: Boolean,
                default: true
            },
            rotation: {
                type: Boolean,
                default: true
            },
            size: {
                type: Number,
                default: 24
            },
            depth: {
                type: Number,
                default: 4
            },
            speed: {
                type: Number,
                default: 0.8
            }
        },
        data() {
            return {
                rotationAnimations: ["forward", "backward"],
                sizeUnits: "px",
                timeUnits: "s"
            };
        },
        computed: {
            spinnerSize() {
                return this.size + this.sizeUnits;
            },
            spinnerDepth() {
                return this.depth + this.sizeUnits;
            },
            spinnerSpeed() {
                return this.speed + this.timeUnits;
            },
            spinnerStyle() {
                return {
                    width: this.spinnerSize,
                    height: this.spinnerSize,
                    borderWidth: this.spinnerDepth,
                    animationDuration: this.spinnerSpeed
                };
            }
        }
    };
</script>

<style lang="scss" scoped>
    .spinner {
        display: inline-block;

        width: 30px;
        height: 30px;

        transform: translateZ(0);

        border-style: solid;
        border-radius: 50%;
        border-color:
            palette("grey", "mystic")
            palette("grey", "mystic")
            palette("grey", "mystic")
            palette("brand", "viking");

        animation-name: forward;
        animation-timing-function: cubic-bezier(0.15, 0.64, 0.83, 0.38), steps(4), linear;
        animation-iteration-count: infinite;
    }

    @keyframes forward {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes backward {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(-360deg);
        }
    }
</style>

