export default {
    data() {
        return {
            errors: null,
        }
    },
    methods: {
        errorFor(field) {
            // it returns this.errors[field] if this errors
            // is different from null and this.errors[field] exists
            return this.errors != null && this.errors[field]
                ? this.errors[field]
                : null;
        },
    },
}
