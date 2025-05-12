import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {
  RECORD_FETCHED_RESPONSE,
  SERVER_ERROR_RESPONSE,
} from "../helper/apiResponse";

import { RECORD_GET_MSG } from "../helper/successMessages";

import Product from "../models/Product";
import Department from "../models/Department";
import Category from "../models/Category";

export const recomendedProjectsList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ids = [15, 16, 17, 18];
    const slugs = ["car-stereo-with-satnav-for-ford-ba-bf-territory-version-6-9.6-inch",
      "car-stereo-with-satnav-for-ford-territory-sz-version-6-9.6-inch",
      "car-stereo-with-satnav-for-ford-fgx-version-6-8-inch",
      "car-stereo-with-satnav-for-ford-falcon-fg-mk1-version-6-9.6-inch",
      "car-stereo-with-satnav-for-ford-falcon-fg-mk2-version-6-8-inch",
      "car-stereo-with-satnav-for-ford-ranger-px1-version-6-2011-2015-9-inch",
      "car-stereo-with-satnav-for-ford-ranger-px1-version-6-13-inch",
      "car-stereo-with-satnav-for-ford-ranger-px2-2015-2021-version-6-9-inch",
      "car-stereo-with-satnav-for-ford-ranger-px2-2015-2021-v6-12.1-inch",
      "car-stereo-with-satnav-for-ford-ranger-pk-2006-2011-version-6-9-inch",
      "car-stereo-with-satnav-for-holden-commodore-ve-series-i-version-6-2006-2011-11-inch",
      "car-stereo-with-satnav-for-holden-commodore-ve2-v6-11-inch",
      "car-stereo-with-satnav-for-holden-vf-commodore-version-6-2013-2017-8-inch",
      "car-stereo-with-satnav-for-holden-commodore-vy-vz-2003-2006-v6-7-inch",
      "car-stereo-with-satnav-for-holden-cruze-2006-2015-version-6-11-inch",
      "car-stereo-with-satnav-for-holden-colorado-2012-2018-v6-9-inch",
      "car-stereo-with-satnav-for-nissan-navara-np300-2015-2021-v6-10-inch",
      "car-stereo-with-satnav-for-nissan-navara-np300-v6-13-inch",
      "headunit-with-carplay-for-nissan-navara-np300-rx-2015-2021-10-inch",
      "car-stereo-with-satnav-for-isuzu-dmax-2012-2019-version-6-9-inch",
      ""
    ]

    const queryConditions = {
      slug: {
        [Op.in]: slugs,
      },
    };

    const result = await Product.findAll({
      where: queryConditions,
      order: Sequelize.literal("RAND()"), // Fetch random records
      limit: 4,
    });

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const AccessororiesList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accessoryId = 18;
    const battery = 16;
    const wiringHarness = 71;
    const framesAndFascia = 22;

    const Acessory = await Department.findOne({ where: { id: accessoryId } });
    const Battery = await Department.findOne({ where: { id: battery } });
    const WiringHarnes = await Category.findOne({
      where: { id: wiringHarness },
    });
    const FrameAndFasci = await Department.findOne({
      where: { id: framesAndFascia },
    });

    const AccessoryConditions = {
      department_id: accessoryId,
      category_id: {
        [Op.notIn]: [wiringHarness, framesAndFascia],
      },
    };

    const batteryConditions = {
      department_id: battery,
    };

    const wiringHarnesConditions = {
      category_id: wiringHarness,
    };

    const framesAndFasciaConditions = {
      department_id: framesAndFascia,
    };

    const acessories = await Product.findAll({
      where: AccessoryConditions,
      order: Sequelize.literal("RAND()"), // Fetch random records
      limit: 4,
    });
    const batteries = await Product.findAll({
      where: batteryConditions,
      order: Sequelize.literal("RAND()"), // Fetch random records
      limit: 4,
    });
    const wiringHarnesses = await Product.findAll({
      where: wiringHarnesConditions,
      order: Sequelize.literal("RAND()"), // Fetch random records
      limit: 4,
    });
    const framesAndFasicia = await Product.findAll({
      where: framesAndFasciaConditions,
      order: Sequelize.literal("RAND()"), // Fetch random records
      limit: 4,
    });

    const result = {
      acessories: { data: acessories, detail: Acessory },
      batteries: { data: batteries, detail: Battery },
      wiring_harness: { data: wiringHarnesses, detail: WiringHarnes },
      frames_and_fascia: { data: framesAndFasicia, detail: FrameAndFasci },
    };

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const audioEquipments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const aplifierId = 66;
    const speakerId = 67;
    const subBooferId = 68;
    const subBooferBoxId = 69;

    const AmpliFier = await Category.findOne({ where: { id: aplifierId } });
    const Speaker = await Category.findOne({ where: { id: speakerId } });
    const subBoofer = await Category.findOne({
      where: { id: subBooferId },
    });
    const SubBooferBox = await Category.findOne({
      where: { id: subBooferBoxId },
    });

    const AmplifierConditions = {
      category_id: aplifierId,
    };

    const speakerConditions = {
      category_id: speakerId,
    };

    const subBooferConditions = {
      category_id: subBooferId,
    };

    const subBooferBoxConditions = {
      category_id: subBooferBoxId,
    };

    const ampiFierProduct = await Product.findAll({
      where: AmplifierConditions,
      order: Sequelize.literal("RAND()"),
      limit: 5,
    });
    const speakerProduct = await Product.findAll({
      where: speakerConditions,
      order: Sequelize.literal("RAND()"),
      limit: 5,
    });
    const subBooferProduct = await Product.findAll({
      where: subBooferConditions,
      order: Sequelize.literal("RAND()"),
      limit: 5,
    });
    const subBooferBoxProduct = await Product.findAll({
      where: subBooferBoxConditions,
      order: Sequelize.literal("RAND()"),
      limit: 5,
    });

    const result = {
      amplifier: { data: ampiFierProduct, detail: AmpliFier },
      speakers: { data: speakerProduct, detail: Speaker },
      subBoofers: { data: subBooferProduct, detail: subBoofer },
      subBooferBox: { data: subBooferBoxProduct, detail: SubBooferBox },
    };

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const weekelyHighLights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const linuxStreoId = 13; //linux
    const satnavStereo = 12; // android
    const carPlayModule = 15;

    const LinuxStereoConditions = {
      department_id: linuxStreoId,
    };

    const satnavStereoConditions = {
      department_id: satnavStereo,
    };

    const carPlayConditions = {
      department_id: carPlayModule,
    };

    const linuxProduct = await Product.findAll({
      where: LinuxStereoConditions,
      // order: [["id", "DESC"]], 
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });
    const satnavProduct = await Product.findAll({
      where: satnavStereoConditions,
      // order: [["id", "DESC"]],  
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });
    const carPlayProduct = await Product.findAll({
      where: carPlayConditions,
      // order: [["id", "DESC"]], 
      order: Sequelize.literal("RAND()"),
      limit: 10,
    });

    const result = {
      linux: { data: linuxProduct },
      android: { data: satnavProduct },
      car_play: { data: carPlayProduct },
    };

    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
    return;
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};

export const hotDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Product.findAll({
      where: { discount_price: { [Op.gte]: 1 } },
      order: Sequelize.literal("RAND()"),  
      limit: 4,
    });
    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};


export const canNotFind = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Product.findAll({
      where: { discount_price: { [Op.gte]: 1 } },
      order: Sequelize.literal("RAND()"),  
      limit: 4,
    });
    RECORD_FETCHED_RESPONSE(res, RECORD_GET_MSG, {
      result: result,
    });
  } catch (error) {
    console.log(error);
    SERVER_ERROR_RESPONSE(res);
  }
};
