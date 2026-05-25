from copy import deepcopy
from typing import Any, Dict, Union

from mat3ra.ade.template import Template
from mat3ra.code.entity import InMemoryEntitySnakeCase
from mat3ra.esse.models.workflow.unit.input._inputItem import ExecutionUnitInputItemSchema, TemplateSchema
from mat3ra.utils.extra.jinja import render_jinja_with_error_handling
from pydantic import Field, field_validator


class ExecutionUnitInput(ExecutionUnitInputItemSchema, InMemoryEntitySnakeCase):
    template: Template = Field(..., description="Input template")

    @field_validator("template", mode="before")
    @classmethod
    def _coerce_template(cls, value: Any) -> Template:
        if isinstance(value, Template):
            return value
        if isinstance(value, TemplateSchema):
            return Template(**value.model_dump(by_alias=True))
        if isinstance(value, dict):
            return Template(**value)
        return value

    @classmethod
    def create_from_template(cls, template: Union[Template, TemplateSchema, Dict[str, Any]]) -> "ExecutionUnitInput":
        if isinstance(template, Template):
            template_instance = template
        elif isinstance(template, TemplateSchema):
            template_instance = Template(**template.model_dump(by_alias=True))
        else:
            template_instance = Template(**template)
        return cls(
            template=template_instance,
            rendered=template_instance.content,
            isManuallyChanged=False,
        )

    def render(self, rendering_context: Dict[str, Any]) -> "ExecutionUnitInput":
        if self.isManuallyChanged:
            return self

        cleaned_context = deepcopy(rendering_context)
        cleaned_context.pop("job", None)
        rendered = render_jinja_with_error_handling(self.template.content, **cleaned_context)
        self.rendered = rendered or self.template.content
        return self
