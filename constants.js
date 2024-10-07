exports.constants = {
    ACCOUNT_TYPES: {
        PERSONNAL:                              "personnal",
        ENTERPRISE:                             "enterprise"
    },
    CONFIRMATION_CODE_AUTHORS: {
        ADMIN:                                  "admin",
        OWNER:                                  "owner",
        USER:                                  "user",
    },
    CONFIRMATION_CODE_SOURCES: {
        REGISTRATION:                            "registration",
        SIGNIN:                                  "signin",
        FORGOTTEN_PASSWORD:                      "forgotten-password"
    },
    HTTP_CODES: {
        RESULT_OK:                              200,
        CREATED:                                201,
        ALREADY_REPORTED:                       208,
        VALIDATION_ERROR:                       400,
        UNAUTHORIZED:                           401,
        FORBIDDEN:                              403,
        NOT_FOUND:                              404,
        SERVER_ERROR:                           500
    },

    MIN_LENGTHS: {
        PASSWORD:                           6,
        CARD_NAME:                          3,
        PHONE_NUMBER:                       6,
        CARD_NUMBER:                        2,
        FULL_NAME:                          2,
        CONFIRMATION_CODE:                  6
    },
    MAX_LENGTHS: {
        EMAIL:                              64,
        PASSWORD:                           32,
        CARD_NAME:                          128,
        CARD_DESCRIPTION:                   255,
        PHONE_NUMBER:                       16,
        CARD_NUMBER:                        128,
        FULL_NAME:                          32,
        ADITIONNAL_EMAIL:                   5,
        CONFIRMATION_CODE:                  6
    },

    FILE_SIZES: {
        CARD_ID:                            50000000
    },

    CALL_BACK_MESSAGES: {
        SUCCESS: {
            CODE:                           "0",
            MESSAGE:                        "Success !"
        },
        ROOT_ALLREADY_CREATED: {
            CODE:                           "E-R-00001-23",
            MESSAGE:                        "Root user has already created."
        },
        INVALID_EMAIL: {
            CODE:                           "E-R-00002-23",
            MESSAGE:                        "Invalid e-mail."
        },
        INVALID_PASSWORD: {
            CODE:                           "E-R-00003-23",
            MESSAGE:                        "The password must contains between 6 and 32 characters."
        },
        INVALID_EMAIL_PASSWORD: {
            CODE:                           "E-R-00004-23",
            MESSAGE:                        "Invalid email or password."
        },
        INVALID_CARD_NAME: {
            CODE:                           "E-R-00005-23",
            MESSAGE:                        "Invalid card name."
        },
        INVALID_CARD_DESCRIPTION: {
            CODE:                           "E-R-00006-23",
            MESSAGE:                        "Invalid card description."
        },
        INVALID_CARD_NAME_DESCRIPTION: {
            CODE:                           "E-R-00007-23",
            MESSAGE:                        "Invalid card name or description."
        },
        UNAUTHORIZED_USER: {
            CODE:                           "E-R-00008-23",
            MESSAGE:                        "Unauthorized user."
        },
        RECORD_WITH_SAME_NAME_EXISTS: {
            CODE:                           "E-R-00009-23",
            MESSAGE:                        "Record with same name already exists."
        },
        RECORD_NOT_FOUND: {
            CODE:                           "E-R-00010-23",
            MESSAGE:                        "Record not found."
        },
        INVALID_PHONE_NUMBER: {
            CODE:                           "E-R-00011-23",
            MESSAGE:                        "Invalid phone number."
        },
        INVALID_CARD_NUMBER: {
            CODE:                           "E-R-00012-23",
            MESSAGE:                        "Invalid card number."
        },
        INVALID_OWNER_DATA: {
            CODE:                           "E-R-00013-23",
            MESSAGE:                        "Invalid owner data."
        },
        INVALID_FILE_TYPE: {
            CODE:                           "E-R-00014-23",
            MESSAGE:                        "File type not supported."
        },
        FILE_TO_LARGE: {
            CODE:                           "E-R-00015-23",
            MESSAGE:                        "File to large."
        },
        INVALID_FULL_NAME: {
            CODE:                           "E-R-00016-23",
            MESSAGE:                        "Invalid full name."
        },
        INVALID_CARD_TYPE_ID: {
            CODE:                           "E-R-00017-23",
            MESSAGE:                        "Invalid card type ID."
        },
        INVALID_ACCOUNT_TYPE: {
            CODE:                           "E-R-00018-23",
            MESSAGE:                        "Invalid account type."
        },
        INVALID_SOCIAL_REASON: {
            CODE:                           "E-R-00019-23",
            MESSAGE:                        "Invalid social reason."
        },
        EMAIL_IN_USE: {
            CODE:                           "E-R-00020-23",
            MESSAGE:                        "E-mail allready in use."
        },
        PHONE_NUMBER_IN_USE: {
            CODE:                           "E-R-00020-23",
            MESSAGE:                        "Phone number allready in use."
        },
        INVALID_ADDITIONAL_EMAIL: {
            CODE:                           "E-R-00020-23",
            MESSAGE:                        "Invalid additional email."
        },
        INVALID_NIF_NUMBER: {
            CODE:                           "E-R-00021-23",
            MESSAGE:                        "Invalid NIF number."
        },
        INVALID_RCCM_NUMBER: {
            CODE:                           "E-R-00021-23",
            MESSAGE:                        "Invalid RCCM number."
        },
        EMAIL_ALREADY_ADDED: {
            CODE:                           "E-R-00022-23",
            MESSAGE:                        "Email already added."
        },
        MAX_ADITIONNAL_EMAIL: {
            CODE:                           "E-R-00023-23",
            MESSAGE:                        "Cannont add more than 5 emails."
        },
        INVALID_CONFIRMATION_CODE: {
            CODE:                           "E-R-00024-23",
            MESSAGE:                        "Invalid confirmation code."
        },
        FILL_ALL_FIELDS: {
            CODE:                           "E-R-00025-23",
            MESSAGE:                        "Please fill all fields."
        },
        PLATE_NUMBER_EXISTS: {
            CODE:                           "E-R-00026-23",
            MESSAGE:                        "Plate number already exists."
        },
        INVALID_AMOUNT: {
            CODE:                           "E-R-00027-23",
            MESSAGE:                        "Ivalid amount."
        },
        INVALID_PAYMENT_CHANNEL: {
            CODE:                           "E-R-00027-23",
            MESSAGE:                        "Ivalid payment channel."
        },
        INVALID_ASSURANCE_NAME: {
            CODE:                           "E-R-00027-23",
            MESSAGE:                        "Ivalid assurance name."
        },
        INVALID_ASSURANCE_TYPE: {
            CODE:                           "E-R-00027-23",
            MESSAGE:                        "Ivalid assurance type."
        },
        INVALID_ISSUE_DATE: {
            CODE:                           "E-R-00027-23",
            MESSAGE:                        "Ivalid issue date."
        },
        INVALID_EXPIRY_DATE: {
            CODE:                           "E-R-00027-23",
            MESSAGE:                        "Ivalid expiry."
        }
    },
    GLOBAL: {
        SBCRYPT_SALT:                       10
    },
    PAYMENT_CHANNELS: {
        CASH:                               "Cash",
        MOBILE_MONEY:                       "Mobile money"
    },
}