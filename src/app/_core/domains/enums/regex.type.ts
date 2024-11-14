export class RegexType {
  public static readonly CodeService = new RegExp(/^[a-zA-z0-9_]*$/, "g");

  public static readonly TextSimple = new RegExp(/^[a-zA-z0-9 ]*$/, "g");

  public static readonly TextNoSpecial = new RegExp(/^[^*|\":<>[\]{}`\\/()';#^&$]*$/);

  public static readonly TextNoSpecialVietnamese = new RegExp(/^([a-zA-Z0-9A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+)$/);

  public static readonly TextHashTags = new RegExp(/#[^\s!\\|§@#$%^&*()\-=+.\/,\[{\]};:`‘“?><]{1,200}(?=\s|$)/g);

  public static readonly Link = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$",
    "i"
  );

  public static readonly LinkYoutube = new RegExp(
    /^http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
  );

  public static readonly Email = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

export class RegexListType {
  hashSigns?: RegExp;
  hashtagAlpha?: RegExp;
  hashtagAlphaNumeric?: RegExp;
  endHashtagMatch?: RegExp;
  hashtagBoundary?: RegExp;
  validHashtag?: RegExp;
}
