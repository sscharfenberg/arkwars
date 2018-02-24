<script>
/*******************************************************************************************************************
 * Star
 * this component displays a single star
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Button from "Game/common/Button/Button.vue";
import Spinner from "Game/common/Spinner/Spinner.vue";
import Planets from "../Planets/Planets.vue";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
export default {
    data: function() {
        return {
            starName: this.name
        };
    },
    validations: {
        starName: {
            // this needs to be synced with /server/config/config.js
            required,
            minLength: minLength(4),
            maxLength: maxLength(40)
        }
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
        },
        planets: {
            type: Array,
            required: true
        }
    },
    computed: {
        spectralClassName () { return `star__spectral--${this.spectral}`; },
        spectralTypeString () { return this.$t("star.spectralType") + ": " + this.spectral; },
        isStarNameSaving () {
            return this.$store.getters.savingStarNameIds.includes(this.id);
        },
        isStarNameEditing () { return this.$store.getters.editingStarNameIds.includes(this.id); }
    },
    components: {
        Icon,
        "btn": Button,
        Spinner,
        Planets
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
            if (this.starName.length < 4) return;
            return this.$store.dispatch("SAVE_STAR_NAME", {id: this.id, starName: this.starName});
        }
    }
};
</script>

<template>
    <article class="star">
        <header class="star__header">
            <div
                class="star__spectral"
                :class="spectralClassName"
                :aria-label="spectralTypeString"
                :title="spectralTypeString">•</div>

            <h1 class="star__name">
                <span
                    class="star__name-text"
                    v-show="!isStarNameEditing">{{ name }}</span>
                <btn
                    v-show="!isStarNameEditing"
                    :on-click="startEditStarName"
                    icon-name="edit"
                    class="star__btn star__btn--edit"
                    :scale="1"
                    :label="$t('star.name.edit')" />

                <div
                    v-show="isStarNameEditing"
                    class="star__edit">
                    <div class="star__name-input">
                        <input
                            v-model="starName"
                            ref="starNameInput"
                            type="text"
                            maxlength="40"
                            :placeholder="$t('star.name.inputPlaceHolder')"
                            :aria-label="$t('star.name.inputPlaceHolder')"
                            @keyup.enter="saveStarName"
                            @keyup.esc="cancelEditStarName"
                            @keyup="$v.starName.$touch()"
                            required>
                    </div>
                    <btn
                        v-show="!isStarNameSaving"
                        :on-click="saveStarName"
                        class="star__btn star__btn--save"
                        :disable="$v.starName.$error"
                        icon-name="done"
                        :scale="1"
                        :label="$t('star.name.save')" />
                    <btn
                        v-show="!isStarNameSaving"
                        :on-click="cancelEditStarName"
                        icon-name="cancel"
                        class="star__btn star__btn--cancel"
                        :scale="1"
                        :label="$t('star.name.cancel')" />
                    <spinner v-if="isStarNameSaving" />
                </div>
            </h1>

            <aside
                class="star__location"
                :aria-label="$t('star.location')"
                :title="$t('star.location')">
                <div class="star__location-inner">
                    <icon
                        class="location-icon"
                        name="location" />
                    <span>{{ coordX }}/{{ coordY }}</span>
                </div>
            </aside>
        </header>
        <div
            v-if="$v.starName.$error"
            class="error-message">
            <div v-if="!$v.starName.minLength">
                {{ $t('star.name.validation.minLength', { min: $v.starName.$params.minLength.min }) }}
            </div>
            <div v-if="!$v.starName.maxLength">
                {{ $t('star.name.validation.maxLength', { max: $v.starName.$params.maxLength.max }) }}
            </div>
            <div v-if="!$v.starName.required">
                {{ $t('star.name.validation.required') }}
            </div>
        </div>
        <planets
            :planets="planets"
            :star-name="name"/>
    </article>
</template>

<style lang="scss" scoped>
    .star {

        background:
            radial-gradient(
                ellipse 35px 35px at 25px 25px,
                transparent 0%,
                transparent 99%,
                palette("grey", "sunken") 100%
            );

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

            text-indent: -1000em;

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
            }
        }

        &__name-text {
            overflow: hidden;

            flex: 1 1 auto;

            font-size: 2.4rem;
            line-height: 4.8rem;
            white-space: nowrap;
            text-overflow: ellipsis;

            @include respond-to("small") {
                font-size: 3rem;
            }
        }

        &__edit {
            display: flex;
            align-items: center;

            flex-grow: 1;
        }

        &__name-input {
            flex-grow: 1;

            > input[type="text"] {
                width: calc(100% - 2.5rem);
                padding: 0.5rem 1rem;
                border: 0;

                background: palette("grey", "deep");
                color: palette("text");

                font-size: 0.7em;
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
                width: 3rem;

                font-size: 0.8em;
                text-align: center;

                @include respond-to("small") {
                    width: 4rem;

                    font-size: 1em;
                }
            }
        }

        .error-message {
            padding: 0.2rem 1rem;

            background: palette("grey", "sunken");
            color: palette("state", "error");

            font-size: 1.2rem;
            text-align: center;
        }
    }
</style>

