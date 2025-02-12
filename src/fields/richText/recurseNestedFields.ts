/* eslint-disable @typescript-eslint/no-use-before-define */
import { Payload } from '../..';
import { Field, fieldHasSubFields, fieldIsArrayType, fieldAffectsData } from '../config/types';
import { PayloadRequest } from '../../express/types';
import { populate } from './populate';
import { recurseRichText } from './relationshipPromise';

type NestedRichTextFieldsArgs = {
  promises: Promise<void>[]
  data: unknown
  fields: Field[]
  req: PayloadRequest
  payload: Payload
  overrideAccess: boolean
  depth: number
  currentDepth?: number
  showHiddenFields: boolean
}

export const recurseNestedFields = ({
  promises,
  data,
  fields,
  req,
  payload,
  overrideAccess = false,
  depth,
  currentDepth = 0,
  showHiddenFields,
}: NestedRichTextFieldsArgs): void => {
  fields.forEach((field) => {
    if (field.type === 'relationship' || field.type === 'upload') {
      if (field.type === 'relationship') {
        if (field.hasMany && Array.isArray(data[field.name])) {
          if (Array.isArray(field.relationTo)) {
            data[field.name].forEach(({ relationTo, value }, i) => {
              const collection = payload.collections[relationTo];
              if (collection) {
                promises.push(populate({
                  id: value,
                  field,
                  collection,
                  data: data[field.name],
                  key: i,
                  overrideAccess,
                  depth,
                  currentDepth,
                  payload,
                  req,
                  showHiddenFields,
                }));
              }
            });
          } else {
            data[field.name].forEach((id, i) => {
              const collection = payload.collections[field.relationTo as string];
              if (collection) {
                promises.push(populate({
                  id,
                  field,
                  collection,
                  data: data[field.name],
                  key: i,
                  overrideAccess,
                  depth,
                  currentDepth,
                  payload,
                  req,
                  showHiddenFields,
                }));
              }
            });
          }
        } else if (Array.isArray(field.relationTo) && data[field.name]?.value && data[field.name]?.relationTo) {
          const collection = payload.collections[data[field.name].relationTo];
          promises.push(populate({
            id: data[field.name].value,
            field,
            collection,
            data: data[field.name],
            key: 'value',
            overrideAccess,
            depth,
            currentDepth,
            payload,
            req,
            showHiddenFields,
          }));
        }
      } else if (typeof data[field.name] !== undefined) {
        const collection = payload.collections[field.relationTo];
        promises.push(populate({
          id: data[field.name],
          field,
          collection,
          data,
          key: field.name,
          overrideAccess,
          depth,
          currentDepth,
          payload,
          req,
          showHiddenFields,
        }));
      }
    } else if (fieldHasSubFields(field) && !fieldIsArrayType(field)) {
      if (fieldAffectsData(field) && typeof data[field.name] === 'object') {
        recurseNestedFields({
          promises,
          data: data[field.name],
          fields: field.fields,
          req,
          payload,
          overrideAccess,
          depth,
          currentDepth,
          showHiddenFields,
        });
      } else {
        recurseNestedFields({
          promises,
          data,
          fields: field.fields,
          req,
          payload,
          overrideAccess,
          depth,
          currentDepth,
          showHiddenFields,
        });
      }
    } else if (Array.isArray(data[field.name])) {
      if (field.type === 'blocks') {
        data[field.name].forEach((row, i) => {
          const block = field.blocks.find(({ slug }) => slug === row?.blockType);
          if (block) {
            recurseNestedFields({
              promises,
              data: data[field.name][i],
              fields: block.fields,
              req,
              payload,
              overrideAccess,
              depth,
              currentDepth,
              showHiddenFields,
            });
          }
        });
      }

      if (field.type === 'array') {
        data[field.name].forEach((_, i) => {
          recurseNestedFields({
            promises,
            data: data[field.name][i],
            fields: field.fields,
            req,
            payload,
            overrideAccess,
            depth,
            currentDepth,
            showHiddenFields,
          });
        });
      }
    }

    if (field.type === 'richText' && Array.isArray(data[field.name])) {
      data[field.name].forEach((node) => {
        if (Array.isArray(node.children)) {
          recurseRichText({
            req,
            children: node.children,
            payload,
            overrideAccess,
            depth,
            currentDepth,
            field,
            promises,
            showHiddenFields,
          });
        }
      });
    }
  });
};
