import { toast } from 'react-toastify';
import { treeifyError } from 'zod';

export async function processServerResponse(res) {
  const ret = await res.json();
  if (!res.ok) {
    if (res.status === 404) {
      toast.error('Resource not found!');
    }

    // if (res.status === 401 || res.status === 403) {
    //   toast.error(ret);
    // }
       if (res.status === 401) {
      toast.error(ret);
    }
    //The error might be happening because the API returns 403 for an empty result. 
    // 403 might mean no todos exist for this user yet - not a real error
    if (res.status === 403 && ret.includes && ret.includes('owner id')) {
// 1. ret.includes (without parentheses)
// This checks if ret has an includes method. It evaluates to:

// true if ret is a string (strings have .includes())
// false/undefined if ret is an object, number, null, etc.
      console.log('No todos found for this user');
      return [];
    }

    if (res.status === 403) {
      toast.error(ret);
    }
    console.log('aHTTP request error status:', res.status, 'message:', ret);
    throw new Error('HTTP request error!');
  }
  // return ret;
  return ret ?? [];
}







export function validateForm(formValues, schema) {
  const res = schema.safeParse(formValues);
  if (res.success !== false) {
    return null;
  }

  const treeErr = treeifyError(res.error);


  const errors = {};
  for (const fieldName in treeErr.properties) {
    if (treeErr.properties[fieldName].properties) {
      // in cazul in care e un obiect validat sub obiectul principal
      for (const nestedField in treeErr.properties[fieldName].properties) {
        if (!errors[fieldName]) {
          errors[fieldName] = {};
        }

        errors[fieldName][nestedField] =
          treeErr.properties[fieldName].properties[nestedField].errors[0];
      }
    } else {
      // cazul in care e un singur field
      errors[fieldName] = treeErr.properties[fieldName].errors[0];
    }
  }

  return errors;
}
