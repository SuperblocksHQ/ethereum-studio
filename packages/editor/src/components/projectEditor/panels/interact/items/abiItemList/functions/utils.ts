import { IRawAbiParameter } from '../../../../../../../models';

export function getPlaceholderText(inputs: IRawAbiParameter[]) {
    const placeholder: string[] = [];
    inputs.map((input) => placeholder.push(`${input.type} ${input.name}`));
    return placeholder.join(', ');
}
