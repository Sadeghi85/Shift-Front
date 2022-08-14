import { defineAbility } from "@casl/ability";

export default defineAbility((can, cannot) => {
  can("locations", "all");
  can("portal-locations.full");
  can("shift-definition.full");
  can("shift-tablet.full");
});
