"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const ExpertSection = () => {
  return (
    <div className="bg-linear-to-r from-[#303441] to-[#303441] mt-25 mb-12 text-background h-[500px]">
      <div className="app-container h-full flex items-center justify-between">
        <div>
          <div className="text-lg font-normal mb-2">
            업계 최고의 전문가들이 컨설팅하고 있어요
          </div>

          <div className="text-4xl leading-normal font-extrabold mb-6">
            학생, 주부, 직장인 누구나 <br />
            최고의 인플루언서가 될 수 있어요
          </div>

          <Button className="bg-lime-500 text-foreground">
            WEHIT 시작하기
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: index is not unique
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: [0, 1, 1], scale: [0, 1.125, 1] }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.25,
                times: [0, 0.6, 1],
              }}
            >
              <Image
                src={`/model-1.png`}
                alt="Expert Section"
                width={276}
                height={324}
                className="w-40"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
