import { defineAbility } from "@casl/ability";

export default defineAbility((can, cannot) => {
  cannot("locations.full");
  can("portal-locations.full");
  can("shift-definition.full");
  can("shift-tablet.full");
});
