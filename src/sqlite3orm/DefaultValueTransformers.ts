import {ValueTransformer} from './ValueTransformer';

// tslint:disable max-classes-per-file
// tslint:disable triple-equals no-null-keyword

export class JsonTransformer implements ValueTransformer {
  toDB(input: any): string|null {
    return (input == undefined) ? null : JSON.stringify(input);
  }

  fromDB(input: string|null): any {
    return (input == null) ? undefined : JSON.parse(input);
  }
}

export class BooleanTextTransformer implements ValueTransformer {
  toDB(input: boolean|undefined): string|null {
    return (input == undefined) ? null : !input ? '0' : '1';
  }

  fromDB(input: string|null): boolean|undefined {
    if (input == null) {
      return undefined;
    }
    if (input === '0' || input === 'false') {
      return false;
    } else if (input === '1' || input === 'true') {
      return true;
    }
    return undefined;
  }
}

export class BooleanNumberTransformer implements ValueTransformer {
  toDB(input: boolean|undefined): number|null {
    return (input == undefined) ? null : !input ? 0 : 1;
  }

  fromDB(input: number|null): boolean|undefined {
    return (input == null) ? undefined : !input ? false : true;
  }
}

export class DateTextTransformer implements ValueTransformer {
  toDB(input: Date|undefined): string|null {
    return (input == undefined) ? null : input.toISOString();
  }

  fromDB(input: string|null): Date|undefined {
    return (input == null) ? undefined : new Date(Date.parse(input));
  }
}

export class DateIntegerTransformer implements ValueTransformer {
  toDB(input: Date|undefined): number|null {
    return (input == undefined) ? null : Math.floor(input.getTime() / 1000);
  }

  fromDB(input: number|null): Date|undefined {
    return (input == null) ? undefined : new Date(Number.isInteger(input) ? input * 1000 : NaN);
  }
}

export class NumberTextTransformer implements ValueTransformer {
  toDB(input: number|undefined): string|null {
    return (input == undefined) ? null : String(input);
  }

  fromDB(input: string|null): number|undefined {
    return (input == null) ? undefined : Number(input);
  }
}

export class NumberDefaultTransformer implements ValueTransformer {
  toDB(input: number|undefined): number|null {
    return (input == undefined) ? null : input;
  }

  fromDB(input: number|null): number|undefined {
    return (input == null) ? undefined : Number(input);
  }
}

export class StringDefaultTransformer implements ValueTransformer {
  toDB(input: string|undefined): string|null {
    return (input == undefined) ? null : input;
  }

  fromDB(input: string|null): string|undefined {
    return (input == null) ? undefined : String(input);
  }
}


export class StringNumberTransformer implements ValueTransformer {
  toDB(input: string|undefined): number|null {
    return (input == undefined) ? null : Number(input);
  }

  fromDB(input: number|null): string|undefined {
    return (input == null) ? undefined : String(input);
  }
}

export class UnknownDefaultTransformer implements ValueTransformer {
  /* istanbul ignore next */
  toDB(input: any|undefined): string|null {
    return (input == undefined) ? null : input;
  }

  /* istanbul ignore next */
  fromDB(input: string|null): string|undefined {
    return (input == null) ? undefined : input;
  }
}
