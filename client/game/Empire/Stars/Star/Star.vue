<script>
    /*******************************************************************************************************************
     * Star
     * this component displays a single star
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    import Button from "Game/common/Button/Button.vue";
    import Spinner from "Game/common/Spinner/Spinner.vue";
    export default {
        data: function() {
            return {
                starName: this.name,
                savingStarName: false
            };
        },
        props: {
            id: {
                type: String,
                required: true
            },
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
        },
        computed: {
            spectralClassName: function () {
                return `star__spectral--${this.spectral}`;
            },
            isStarNameSaving: function () {
                return this.$store.getters.savingStarNameIds.includes(this.id);
            },
            isStarNameEditing: function () {
                return this.$store.getters.editingStarNameIds.includes(this.id);
            }
        },
        components: {
            "icon": Icon,
            "btn": Button,
            "spinner": Spinner
        },
        methods: {
            startEditStarName() {
                this.$store.dispatch("EDIT_STAR_NAME", {id: this.id, editing: true});
                this.$nextTick( function () {
                    // wait for next render tick because the element might not be focussable yet
                    return this.$refs.starNameInput.focus();
                });
            },
            cancelEditStarName() {
                this.starName = this.name;
                return this.$store.dispatch("EDIT_STAR_NAME", {id: this.id, editing: false});
            },
            saveStarName() {
                this.savingStarName = true;
                return this.$store.dispatch("SAVE_STAR_NAME", {id: this.id, starName: this.starName});
            }
        }
    };
</script>

<template>
    <article class="star">
        <header class="star__header">
            <div class="star__spectral"
                v-bind:class="spectralClassName"
                aria-label="Spectral Type"
                title="Spectral Type"></div>

            <h1 class="star__name">
                <span
                    class="star__name-text"
                    v-show="!isStarNameEditing">{{ name }}</span>
                <btn
                    v-if="!isStarNameEditing"
                    :onClick="startEditStarName"
                    iconName="edit"
                    class="star__btn star__btn--edit"
                    label="edit star name"/>

                <span v-show="isStarNameEditing" class="star__edit">
                    <input
                        type="text"
                        v-model="starName"
                        maxlength="40"
                        ref="starNameInput"
                        @keyup.enter="saveStarName"
                        @keyup.esc="cancelEditStarName" />
                    <btn
                        v-if="!isStarNameSaving"
                        :onClick="saveStarName"
                        iconName="done"
                        class="star__btn star__btn--save"
                        label="Save star name" />
                    <btn
                        v-if="!isStarNameSaving"
                        :onClick="cancelEditStarName"
                        iconName="cancel"
                        class="star__btn star__btn--cancel"
                        label="Cancel editing starname" />
                    <spinner v-if="isStarNameSaving" />
                </span>
            </h1>

            <aside class="star__location"
                   aria-label="Star Location"
                   title="Star Location">
                <div class="star__location-inner">
                    <icon class="location-icon" name="location" />
                    <span>{{ coordX }}/{{ coordY }}</span>
                </div>
            </aside>
        </header>
    </article>
</template>

<style lang="scss" scoped>
    .star {
        &__header {
            display: flex;

            height: 48px;
        }

        &__spectral {
            z-index: z("form");

            height: 48px;
            flex: 0 0 48px;

            background: url("./spectral-types.png") 0 0 no-repeat;
            background-size: 48px;
            border-top-right-radius: 50%;
            border-bottom-right-radius: 50%;

            &--O { background-position: 0 0; }
            &--B { background-position: 0 -48px; }
            &--A { background-position: 0 -96px; }
            &--F { background-position: 0 -144px; }
            &--G { background-position: 0 -192px; }
            &--K { background-position: 0 -240px; }
            &--M { background-position: 0 -288px; }
            &--Y { background-position: 0 -336px; }
        }

        &__name {
            display: flex;
            align-items: center;

            overflow: hidden;

            padding-left: 3.5rem;
            margin: 0 0 0 -2rem;
            flex: 1 1 auto;

            background:
                radial-gradient(
                    ellipse 35px 35px at -7px 50%,
                    transparent 0%,
                    transparent 99%,
                    palette("grey", "sunken") 100%
                );
            color: palette("text");

            font-weight: 300;
            line-height: 1;

            @include respond-to("small") {
                margin-left: -1rem;

                background:
                    radial-gradient(
                        ellipse 35px 35px at -12px 50%,
                        transparent 0%,
                        transparent 99%,
                        palette("grey", "sunken") 100%
                    );
            }
        }

        &__name-text {
            overflow: hidden;

            flex: 1 1 auto;

            white-space: nowrap;
            text-overflow: ellipsis;
        }

        &__edit {
            display: flex;
            align-items: center;

            flex-grow: 1;

            > input[type="text"] {
                padding: 0.5rem 1rem;
                border: 0;
                flex-grow: 1;

                background: transparent;
                color: palette("text");

                font-size: 0.8em;
                font-weight: 100;
                line-height: 1;

                &:focus {
                    background: palette("grey", "raven");
                    color: palette("grey", "white");
                    outline: 0;
                }
            }
        }

        &__btn {
            &--edit {
                margin-left: auto;
            }

            &--cancel,
            &--save {
                margin-left: 1rem;
            }
        }

        &__location {
            display: flex;
            align-items: center;

            padding: 0 0 0 0.5rem;

            background-color: palette("grey", "sunken");
            color: palette("text", "subdued");

            @include respond-to("small") {
                padding: 0 1rem;
            }
        }

        &__location-inner {
            display: flex;
            align-items: center;

            padding: 0.5rem;

            background-color: palette("grey", "bunker");

            > .location-icon {
                margin-right: 1rem;

                color: darken(palette("text", "subdued"), 25%);
            }

            > span {
                width: 4rem;

                text-align: center;
            }
        }
    }
</style>

