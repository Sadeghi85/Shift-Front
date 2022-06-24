<script>
import { defineComponent } from "vue";

export default defineComponent({
  //mixins: [yaldaVueUtilities],
  props: {
    value: String,
    id: String,
    class2: String,
  },
  mounted: function () {
    $(this.$el).mask("9999/99/99");
    $(this.$el).MdPersianDateTimePicker({
      Trigger: "click",
      EnableTimePicker: false,
      TargetSelector: "#" + this.id,
      DisableBeforeToday: false,
      Disabled: false,
      Format: "yyyy/MM/dd",
      IsGregorian: false,
      EnglishNumber: false,
    });
    //const component = this;
    $(this.$el).on("hidden.bs.popover", () => {
      //console.log("hidden.bs.popover      is: " + $(component.$el).val());
      this.$emit("input", $(this.$el).val());
    });
  },
  methods: {
    updateValue: function ($event) {
      this.$emit("input", $event.target.value);
    },
  },
  template: `<input type="text" :id="id" :value="value" @input="updateValue()" 
		class="form-control date-control" placeholder="تاریخ را وارد کنید" />`,
});
</script>
