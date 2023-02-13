import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Search } from ".";

export default {
  component: Search,
} as ComponentMeta<typeof Search>;

const Template: ComponentStory<typeof Search> = (args) => <Search {...args} />;

export const Primary = Template.bind({});
Primary.args = {};
