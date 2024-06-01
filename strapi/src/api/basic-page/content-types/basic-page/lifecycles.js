const { triggerConfigInvalidate } = require("../../../../heiexperts");

module.exports = {
  async afterCreate() {
    await triggerConfigInvalidate();
  },
  async afterUpdate() {
    await triggerConfigInvalidate();
  },
};
